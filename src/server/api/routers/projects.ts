import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import { projects_table, users_table } from "~/server/db/schema";

export const projectsRouter = createTRPCRouter({
  getProjectsByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const user = await db
        .select({ id: users_table.id })
        .from(users_table)
        .where(eq(users_table.username, input.username));

      const foundUser = user[0];

      if (!foundUser) {
        return [];
      }

      const projects = await db
        .select({
          id: projects_table.id,
          github_id: projects_table.github_id,
          github_url: projects_table.github_url,
          name: projects_table.name,
          description: projects_table.description,
          created_on: projects_table.created_on,
          updated_on: projects_table.updated_on,
        })
        .from(projects_table)
        .where(eq(projects_table.user_id, BigInt(foundUser.id)));

      return projects.sort(
        (a, b) => b.updated_on.getTime() - a.updated_on.getTime(),
      );
    }),
  isProjectNameAvailable: publicProcedure
    .input(z.object({ name: z.string().trim().min(1) }))
    .query(async ({ input }) => {
      const existingProject = await db
        .select({ id: projects_table.id })
        .from(projects_table)
        .where(eq(projects_table.name, input.name.trim()));

      return existingProject.length === 0;
    }),
  createProject: publicProcedure
    .input(
      z.object({
        username: z.string(),
        github_id: z.number().int(),
        github_url: z.string().url(),
        name: z.string().trim().min(1),
        description: z.string().trim().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await db
        .select({ id: users_table.id })
        .from(users_table)
        .where(eq(users_table.username, input.username));

      const foundUser = user[0];

      if (!foundUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const nameToUse = input.name.trim();

      try {
        await db.insert(projects_table).values({
          user_id: BigInt(foundUser.id),
          github_id: input.github_id,
          github_url: input.github_url,
          name: nameToUse,
          description: input.description?.trim() ?? null,
          created_on: new Date(),
          updated_on: new Date(),
        });
      } catch (error: unknown) {
        if (isDuplicateProjectNameError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Project name is already taken",
          });
        }

        throw error;
      }
    }),
  updateProject: publicProcedure
    .input(
      z
        .object({
          username: z.string(),
          projectId: z.number().int(),
          name: z.string().trim().min(1).optional(),
          description: z.string().trim().optional(),
          github_url: z.string().url().optional(),
        })
        .refine(
          (input) =>
            input.name !== undefined ||
            input.description !== undefined ||
            input.github_url !== undefined,
          {
            message: "At least one project field must be provided",
          },
        ),
    )
    .mutation(async ({ input }) => {
      const user = await db
        .select({ id: users_table.id })
        .from(users_table)
        .where(eq(users_table.username, input.username));

      const foundUser = user[0];
      if (!foundUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const updateValues: {
        name?: string;
        description?: string | null;
        github_url?: string;
        updated_on: Date;
      } = {
        updated_on: new Date(),
      };

      if (input.name !== undefined) {
        updateValues.name = input.name.trim();
      }

      if (input.description !== undefined) {
        updateValues.description = input.description.trim() || null;
      }

      if (input.github_url !== undefined) {
        updateValues.github_url = input.github_url;
      }

      try {
        await db
          .update(projects_table)
          .set(updateValues)
          .where(
            and(
              eq(projects_table.id, input.projectId),
              eq(projects_table.user_id, BigInt(foundUser.id)),
            ),
          );
      } catch (error: unknown) {
        if (isDuplicateProjectNameError(error)) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Project name is already taken",
          });
        }

        throw error;
      }
    }),
});

function isDuplicateProjectNameError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const maybeError = error as { code?: string; message?: string };

  return (
    maybeError.code === "ER_DUP_ENTRY" ||
    maybeError.code === "23000" ||
    maybeError.message?.includes("Duplicate entry") === true
  );
}
