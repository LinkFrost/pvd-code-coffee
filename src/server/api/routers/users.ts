import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "~/server/db";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { users_table } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
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
