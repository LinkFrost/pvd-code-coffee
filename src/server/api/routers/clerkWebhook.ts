import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { users_table } from "~/server/db/schema";

export const clearkWebhookRouter = createTRPCRouter({
  clerkEvent: publicProcedure
    .input(
      z.object({
        type: z.string(),
        data: z
          .object({
            id: z.string(),
            first_name: z.string().nullable(),
            last_name: z.string().nullable(),
            email_address: z.string().email(),
            username: z.string().nullable(),
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
          });

          break;
        case "user.updated":
          console.log("User updated:", input.data);
          // TODO: Update user data in your database
          break;
        case "user.deleted":
          console.log("User deleted:", input.data);
          // TODO: Handle user deletion in your database
          break;
        default:
          console.log(`Unhandled webhook event: ${input.type}`, input.data);
      }

      return { success: true };
    }),
});
