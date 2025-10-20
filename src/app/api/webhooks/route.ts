import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { NextRequest } from "next/server";
import { env } from "~/env";
import type { UserJSON, DeletedObjectJSON } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: env.CLERK_SIGNING_SECRET,
    });

    const eventType = evt.type;
    const eventData = evt.data as UserJSON | DeletedObjectJSON;

    const ctx = await createTRPCContext({
      headers: req.headers,
    });

    const caller = createCaller(ctx);

    if (eventType === "user.created" || eventType === "user.updated") {
      await caller.clearkWebhookRouter.clerkCreateUpdateUser({
        type: eventType,
        data: {
          ...(eventData as UserJSON),
          email_address:
            (eventData as UserJSON).email_addresses?.[0]?.email_address ?? null,
        },
      });
    } else if (eventType === "user.deleted") {
      await caller.clearkWebhookRouter.clerkDeleteUser({
        id: eventData.id!,
      });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Error verifying webhook: " + (err as string), {
      status: 400,
    });
  }
}
