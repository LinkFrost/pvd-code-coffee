import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";

import { NewProjectSection } from "~/components/projects/NewProjectButton";
import { ProjectCard } from "~/components/ProjectCard";
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

  const projectsResult = await apiResult(api.projects.getAllProjects());
  const projects = projectsResult.success ? projectsResult.data : [];

  return (
    <HydrateClient>
      <div className="flex flex-col justify-center align-middle">
        <section className="bg-accent">
          <div className="responsiveContainer flex h-full flex-col items-center justify-between gap-6 py-12 sm:py-16">
            <h1 className="break-words text-center font-din text-3xl font-bold">
              Projects
            </h1>

            <p className="max-w-3xl text-center text-lg sm:text-2xl">
              Check out what the community is building. Whether it&apos;s a side
              project, a new tool, or a full fledged application, we want to
              showcase it here.
            </p>
          </div>
        </section>

        <section className="bg-gray-100">
          <div className="responsiveContainer flex flex-col gap-8 py-10">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-din text-3xl font-semibold">All Projects</h2>

              {showNewProject && currentUsername && (
                <Suspense fallback={<Spinner className="size-6" />}>
                  <NewProjectSection
                    username={currentUsername}
                    userId={session.userId}
                  />
                </Suspense>
              )}
            </div>

            {!projectsResult.success ? (
              <p className="text-xl text-neutral-600">
                We couldn&apos;t load projects right now. Please try again
                later.
              </p>
            ) : projects.length === 0 ? (
              <p className="text-xl text-neutral-600">
                No projects yet. Check back soon, or add your own when
                you&apos;re signed in.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    name={project.name}
                    description={project.description}
                    githubUrl={project.github_url}
                    creatorName={project.creator_username ?? "member"}
                    createdOn={project.created_on}
                    updatedOn={project.updated_on}
                    tags={project.tags}
                    status={project.status}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
