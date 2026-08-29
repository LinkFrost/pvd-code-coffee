import type { SQL } from "drizzle-orm";
import { and, asc, desc, eq, ne, or, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { z } from "zod";
import {
  parseProjectTags,
  type ProjectStatus,
  projectStatusSchema,
  projectTagsInputSchema,
  serializeProjectTags,
} from "~/utils/projectUtils";
import { provider } from "~/utils/constants";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "~/server/db";
import { projects_table, users_table } from "~/server/db/schema";

/** Input for `getProjects`; exported for UI / validation reuse. */
export const getProjectsInputSchema = z.object({
  search: z.string().trim().max(500).optional(),
  tags: z.array(z.string().trim().min(1)).max(32).optional(),
  status: projectStatusSchema.optional().nullable(),
  sortBy: z.enum(["updated_on", "created_on", "name"]).default("updated_on"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export const projectsRouter = createTRPCRouter({
  getProjects: publicProcedure
    .input(getProjectsInputSchema.optional())
    .query(async ({ input }) => {
      const params = getProjectsInputSchema.parse(input ?? {});

      const conditions: SQL[] = [];

      const searchTerm = params.search?.trim();
      if (searchTerm) {
        const needle = searchTerm.toLowerCase();
        conditions.push(
          sql`LOCATE(${needle}, LOWER(${projects_table.name})) > 0`,
        );
      }

      const tagList = params.tags?.filter((t) => t.length > 0) ?? [];
      /** Tags are stored as a JSON array string; match each tag’s JSON-encoded token. (SingleStore here does not expose MySQL’s JSON_CONTAINS.) */
      if (tagList.length === 1) {
        const needle = JSON.stringify(tagList[0]);
        conditions.push(sql`LOCATE(${needle}, ${projects_table.tags}) > 0`);
      } else if (tagList.length > 1) {
        const tagOr = or(
          ...tagList.map((tag) => {
            const needle = JSON.stringify(tag);
            return sql`LOCATE(${needle}, ${projects_table.tags}) > 0`;
          }),
        );
        if (tagOr) {
          conditions.push(tagOr);
        }
      }

      if (params.status != null) {
        conditions.push(eq(projects_table.status, params.status));
      }

      const orderColumn =
        params.sortBy === "created_on"
          ? projects_table.created_on
          : params.sortBy === "name"
            ? sql`LOWER(${projects_table.name})`
            : projects_table.updated_on;

      const orderFn = params.sortDir === "asc" ? asc : desc;

      const whereClause =
        conditions.length > 0 ? and(...conditions) : sql`TRUE`;

      const rows = await db
        .select({
          id: projects_table.id,
          github_url: projects_table.github_url,
          project_url: projects_table.project_url,
          name: projects_table.name,
          description: projects_table.description,
          tags: projects_table.tags,
          status: projects_table.status,
          created_on: projects_table.created_on,
          updated_on: projects_table.updated_on,
          creator_username: users_table.username,
        })
        .from(projects_table)
        .innerJoin(users_table, eq(projects_table.user_id, users_table.id))
        .where(whereClause)
        .orderBy(orderFn(orderColumn));

      return rows.map((row) => ({
        ...row,
        tags: parseProjectTags(row.tags),
        status: row.status as ProjectStatus,
      }));
    }),

  getProjectByName: publicProcedure
    .input(z.object({ name: z.string().trim().min(1) }))
    .query(async ({ input }) => {
      const rows = await db
        .select({
          id: projects_table.id,
          github_url: projects_table.github_url,
          project_url: projects_table.project_url,
          name: projects_table.name,
          description: projects_table.description,
          tags: projects_table.tags,
          status: projects_table.status,
          created_on: projects_table.created_on,
          updated_on: projects_table.updated_on,
          creator_username: users_table.username,
          creator_clerk_id: users_table.clerk_id,
          creator_first_name: users_table.first_name,
          creator_last_name: users_table.last_name,
        })
        .from(projects_table)
        .innerJoin(users_table, eq(projects_table.user_id, users_table.id))
        .where(eq(projects_table.name, input.name))
        .limit(1);

      const row = rows[0];
      if (!row) {
        return null;
      }

      return {
        ...row,
        tags: parseProjectTags(row.tags),
        status: row.status as ProjectStatus,
      };
    }),

  getProjectsByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const projects = await db
        .select({
          id: projects_table.id,
          github_id: projects_table.github_id,
          github_url: projects_table.github_url,
          project_url: projects_table.project_url,
          name: projects_table.name,
          description: projects_table.description,
          tags: projects_table.tags,
          status: projects_table.status,
          created_on: projects_table.created_on,
          updated_on: projects_table.updated_on,
        })
        .from(projects_table)
        .innerJoin(users_table, eq(projects_table.user_id, users_table.id))
        .where(eq(users_table.username, input.username))
        .orderBy(desc(projects_table.updated_on));
      return projects.map((p) => ({
        ...p,
        tags: parseProjectTags(p.tags),
        status: p.status as ProjectStatus,
      }));
    }),

  getUserGithubRepos: publicProcedure.query(async () => {
    const session = await auth();
    const userId = session.userId;

    if (!userId) {
      return [];
    }

    try {
      const clerk = await clerkClient();
      const tokenResponse = await clerk.users.getUserOauthAccessToken(
        userId,
        provider,
      );
      const accessToken = tokenResponse.data[0]?.token;

      if (!accessToken) {
        return [];
      }

      const response = await fetch("https://api.github.com/user/repos", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        return [];
      }

      const gitHubResponse: unknown = await response.json();

      const parsedGitHubResponse = z
        .array(
          z.object({
            id: z.number(),
            name: z.string(),
            description: z.string().nullable(),
            html_url: z.string(),
          }),
        )
        .safeParse(gitHubResponse);

      return parsedGitHubResponse.success ? parsedGitHubResponse.data : [];
    } catch (error) {
      console.error("Unable to load user GitHub repositories", error);
      return [];
    }
  }),

  isProjectNameAvailable: publicProcedure
    .input(
      z.object({
        name: z.string().trim().min(1),
        excludeProjectId: z.number().int().optional(),
      }),
    )
    .query(async ({ input }) => {
      const nameClause = eq(projects_table.name, input.name.trim());
      const whereClause =
        input.excludeProjectId !== undefined
          ? and(nameClause, ne(projects_table.id, input.excludeProjectId))
          : nameClause;

      const existingProject = await db
        .select({ id: projects_table.id })
        .from(projects_table)
        .where(whereClause);

      return existingProject.length === 0;
    }),

  createProject: publicProcedure
    .input(
      z.object({
        username: z.string(),
        github_id: z.number().int(),
        github_url: z.string().url(),
        project_url: z.string().max(2048).optional(),
        name: z.string().trim().min(1),
        description: z.string().trim().optional(),
        tags: projectTagsInputSchema,
        status: projectStatusSchema,
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
          project_url: input.project_url ? input.project_url.trim() : null,
          name: nameToUse,
          description: input.description?.trim() ?? null,
          tags: serializeProjectTags(input.tags),
          status: input.status,
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
          projectId: z.number().int(),
          name: z.string().trim().min(1).optional(),
          description: z.string().trim().optional(),
          github_url: z.string().url().optional(),
          project_url: z
            .union([z.literal(""), z.null(), z.string().max(2048)])
            .optional(),
          tags: projectTagsInputSchema.optional(),
          status: projectStatusSchema.optional(),
        })
        .refine(
          (input) =>
            input.name !== undefined ||
            input.description !== undefined ||
            input.github_url !== undefined ||
            input.project_url !== undefined ||
            input.tags !== undefined ||
            input.status !== undefined,
          {
            message: "At least one project field must be provided",
          },
        ),
    )
    .mutation(async ({ input }) => {
      const session = await auth();
      const clerkUserId = session.userId;

      if (!clerkUserId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not signed in",
        });
      }

      const user = await db
        .select({ id: users_table.id })
        .from(users_table)
        .where(eq(users_table.clerk_id, clerkUserId));

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
        project_url?: string | null;
        tags?: string;
        status?: string;
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

      if (input.project_url !== undefined) {
        if (input.project_url === "" || input.project_url === null) {
          updateValues.project_url = null;
        } else {
          const t = input.project_url.trim();
          updateValues.project_url = t.length > 0 ? t : null;
        }
      }

      if (input.tags !== undefined) {
        updateValues.tags = serializeProjectTags(input.tags);
      }

      if (input.status !== undefined) {
        updateValues.status = input.status;
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
