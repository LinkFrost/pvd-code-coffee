import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createCaller } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import type { NextRequest } from "next/server";
import { env } from "~/env";
import type { UserJSON } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req, {
      signingSecret: env.CLERK_SIGNING_SECRET,
    });

    const eventType = evt.type;
    const eventData = evt.data as UserJSON;

    const ctx = await createTRPCContext({
      headers: req.headers,
    });

    const caller = createCaller(ctx);

    await caller.clearkWebhookRouter.clerkEvent({
      type: eventType,
      data: {
        ...eventData,
        email_address: eventData.email_addresses[0]?.email_address ?? "",
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
