import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { users_table } from "~/server/db/schema";

export const clearkWebhookRouter = createTRPCRouter({
  clerkCreateUpdateUser: publicProcedure
    .input(
      z.object({
        type: z.string(),
        data: z
          .object({
            id: z.string(),
            first_name: z.string().nullable(),
            last_name: z.string().nullable(),
            email_address: z.string().email().nullable(),
            username: z.string().nullable(),
            image_url: z.string().nullable(),
          })
          .passthrough(),
      }),
    )
    .mutation(async ({ input }) => {
      switch (input.type) {
        case "user.created":
          await db.insert(users_table).values({
            clerk_id: input.data.id,
            first_name: input.data.first_name,
            last_name: input.data.last_name,
            email_address: input.data.email_address,
            username: input.data.username,
            image_url: input.data.image_url,
          });

          break;
        case "user.updated":
          await db
            .update(users_table)
            .set({
              first_name: input.data.first_name,
              last_name: input.data.last_name,
              email_address: input.data.email_address,
              username: input.data.username,
              image_url: input.data.image_url,
            })
            .where(eq(users_table.clerk_id, input.data.id));

          break;
        default:
          console.log(`Unhandled webhook event: ${input.type}`, input.data);
      }

      return { success: true };
    }),
  clerkDeleteUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      await db.delete(users_table).where(eq(users_table.clerk_id, input.id));

      return { success: true };
    }),
});
