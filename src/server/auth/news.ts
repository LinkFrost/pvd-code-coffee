import "server-only";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const requireNewsAuthor = async () => {
  const session = await auth();
  const role = session.sessionClaims?.metadata?.role;

  if (!session.userId || (role !== "admin" && role !== "author")) {
    redirect("/");
  }

  return {
    userId: session.userId,
    role,
  };
};
