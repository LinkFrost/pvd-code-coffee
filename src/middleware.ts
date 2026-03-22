import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Always run Clerk on app routes whose slugs can contain dots (the generic
    // static-file skip below would otherwise skip middleware for paths like
    // /profile/installHook.js.map and break auth()).
    "/profile/:path*",
    "/projects/:path*",
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // "/((?!.*\\..*|_next).*)",
    // "/",
    // "/(api|trpc)(.*)",
  ],
};
