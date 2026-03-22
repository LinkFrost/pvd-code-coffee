import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

import { isPlausibleProfileUsername } from "~/lib/route-slugs";
import { api, apiResult, HydrateClient } from "~/trpc/server";
import Image from "next/image";
import { EditProfileDialog } from "~/components/profile/EditProfileDialog";
import { NewProjectSection } from "~/components/projects/NewProjectButton";
import { ProjectCard } from "~/components/ProjectCard";
import { Suspense } from "react";
import { Spinner } from "~/components/ui/spinner";

export default async function Profile(props: {
  params: Promise<{ username: string }>;
}) {
  const params = await props.params;
  const username = decodeURIComponent(params.username);

  if (!isPlausibleProfileUsername(username)) {
    notFound();
  }

  const session = await auth();

  const userResult = await apiResult(
    api.users.getUserByUsername({ username }),
  );

  const projectsResult = await apiResult(
    api.projects.getProjectsByUsername({
      username,
    }),
  );

  const user = userResult.success ? userResult.data : undefined;
  const projects = projectsResult.success ? projectsResult.data : [];

  if (!userResult.success) {
    return (
      <HydrateClient>
        <div className="flex min-h-[70vh] w-full items-center justify-center">
          <p className="font-din text-2xl">
            We couldn&apos;t load this profile right now.
          </p>
        </div>
      </HydrateClient>
    );
  }

  if (!user) {
    return (
      <HydrateClient>
        <div className="flex min-h-[70vh] w-full items-center justify-center">
          <p className="font-din text-2xl">User not found.</p>
        </div>
      </HydrateClient>
    );
  }

  const isLoggedInUser = user?.clerk_id === session?.userId;

  return (
    <div className="flex h-full flex-col justify-center align-middle">
      <section className="bg-accent">
        <div className="responsiveContainer flex h-full flex-col items-start gap-4 py-4 sm:gap-8 sm:py-12">
          <div className="flex w-full flex-col items-center gap-4 sm:gap-8 md:flex-row md:justify-between md:gap-0">
            <div className="flex items-center gap-8">
              <Image
                src={user.image_url ?? "./placeholder.svg"}
                alt={user.username ?? "Profile Image"}
                width={100}
                height={100}
                className="rounded-full"
              />

              <div className="flex flex-col items-start justify-center">
                <span className="text-center font-din text-3xl md:text-4xl">
                  {user.first_name} {user.last_name}
                </span>

                <span className="text-center font-din text-2xl">
                  {user.username}
                </span>
              </div>
            </div>

            {isLoggedInUser && (
              <EditProfileDialog
                username={user.username ?? ""}
                bio={user.bio}
              />
            )}
          </div>

          <p className="p-2 text-lg sm:p-4">
            {user.bio ?? 'Click "Edit Profile" to add a bio'}
          </p>
        </div>
      </section>

      <section className="bg-gray-100">
        <div className="responsiveContainer flex flex-col gap-8 py-10">
          <div className="flex items-center justify-between">
            <h2 className="font-din text-3xl font-semibold">Projects</h2>
            {isLoggedInUser && (
              <Suspense fallback={<Spinner className="size-6" />}>
                <NewProjectSection
                  username={user.username ?? username}
                  userId={session?.userId}
                />
              </Suspense>
            )}
          </div>

          {!projectsResult.success ? (
            <p className="text-xl text-neutral-600">
              We couldn&apos;t load this user&apos;s projects right now.
            </p>
          ) : projects.length === 0 ? (
            <p className="text-xl text-neutral-600">
              {isLoggedInUser
                ? 'You have no projects yet. Click "New Project" to add your first one.'
                : "No projects yet."}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  name={project.name}
                  description={project.description}
                  projectUrl={project.project_url}
                  githubUrl={project.github_url}
                  creatorName={user?.username ?? username}
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
  );
}
