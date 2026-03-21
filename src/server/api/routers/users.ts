import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { users_table } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
  getUserByClerkId: publicProcedure
    .input(z.object({ clerkId: z.string().min(1) }))
    .query(async ({ input }) => {
      const user = await db
        .selectDistinct()
        .from(users_table)
        .where(eq(users_table.clerk_id, input.clerkId));

      return user[0] ?? null;
    }),
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ input }) => {
      const user = await db
        .selectDistinct()
        .from(users_table)
        .where(eq(users_table.username, input.username));

      return user[0];
    }),
  updateUserProfile: publicProcedure
    .input(z.object({ username: z.string(), bio: z.string() }))
    .mutation(async ({ input }) => {
      await db
        .update(users_table)
        .set({ bio: input.bio })
        .where(eq(users_table.username, input.username));
    }),
});
