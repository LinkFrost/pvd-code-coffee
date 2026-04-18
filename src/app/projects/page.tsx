import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

import { NewProjectDialog } from "~/components/profile/NewProjectDialog";
import { ProjectsCatalog } from "~/components/projects/ProjectsCatalog";
import { Spinner } from "~/components/ui/spinner";
import { api, apiResult, HydrateClient } from "~/trpc/server";

export default async function Projects() {
  const session = await auth();

  const clerkUserResult = session.userId
    ? await apiResult(api.users.getUserByClerkId({ clerkId: session.userId }))
    : { success: false as const };

  const currentUser =
    clerkUserResult.success && clerkUserResult.data
      ? clerkUserResult.data
      : null;
  const currentUsername = currentUser?.username?.trim() ?? null;

  const showNewProject = Boolean(session.userId && currentUsername);

  return (
    <HydrateClient>
      <div className="flex flex-col justify-center align-middle">
        <section className="bg-accent">
          <div className="responsiveContainer flex h-full flex-col items-center justify-between gap-6 py-12 sm:py-16">
            <h1 className="break-words text-center font-din text-3xl font-bold">
              Projects
            </h1>

            <p className="max-w-3xl text-center text-lg sm:text-2xl">
              Check out what the community is building! Whether it&apos;s a
              quick side project, a new tool, or a full fledged live
              application, we want to showcase it here.
            </p>
          </div>
        </section>

        <section className="bg-gray-100">
          <div className="responsiveContainer flex flex-col gap-8 py-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-din text-3xl font-semibold">All Projects</h2>

              {showNewProject && currentUsername && (
                <NewProjectDialog username={currentUsername} />
              )}
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center gap-2 py-16 text-neutral-600">
                  <Spinner className="size-8" />
                  <span>Loading projects…</span>
                </div>
              }
            >
              <ProjectsCatalog />
            </Suspense>
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
