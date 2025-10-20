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

    await caller.clearkWebhookRouter.clerkEvent({
      type: eventType,
      data: {
        id: eventData.id!,
        first_name: (eventData as UserJSON).first_name,
        last_name: (eventData as UserJSON).last_name,
        email_address:
          (eventData as UserJSON).email_addresses?.[0]?.email_address ?? null,
        username: (eventData as UserJSON).username,
      },
    });

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Error verifying webhook: " + (err as string), {
      status: 400,
    });
  }
}
