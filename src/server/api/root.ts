import { createCallerFactory, createTRPCRouter } from "../../server/api/trpc";
import { meetupRouter } from "./routers/meetup";
import { clearkWebhookRouter } from "./routers/clerkWebhook";
import { usersRouter } from "./routers/users";
import { projectsRouter } from "./routers/projects";
import { newsRouter } from "./routers/news";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  meetup: meetupRouter,
  clearkWebhookRouter: clearkWebhookRouter,
  users: usersRouter,
  projects: projectsRouter,
  news: newsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
