import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/twUtils";
import {
  projectStatusBadgeClassName,
  projectTagBadgeClassName,
} from "~/lib/projects";
import { fetchProjectReadme } from "~/server/lib/github-readme";
import { api, apiResult, HydrateClient } from "~/trpc/server";

export default async function ProjectDetails(props: {
  params: Promise<{ projectName: string }>;
}) {
  const params = await props.params;
  const decodedName = decodeURIComponent(params.projectName);

  const projectResult = await apiResult(
    api.projects.getProjectByName({ name: decodedName }),
  );

  if (!projectResult.success) {
    return (
      <HydrateClient>
        <div className="responsiveContainer flex min-h-[50vh] items-center justify-center py-16">
          <p className="font-din text-xl text-neutral-600">
            We couldn&apos;t load this project right now.
          </p>
        </div>
      </HydrateClient>
    );
  }

  const project = projectResult.data;

  if (!project) {
    notFound();
  }

  const projectReadme = await fetchProjectReadme(project.github_url);

  return (
    <HydrateClient>
      <div className="flex flex-col justify-center align-middle">
        <section className="bg-accent">
          <div className="responsiveContainer flex flex-col gap-6 py-12 sm:py-16">
            <h1 className="break-words text-center font-din text-3xl font-bold md:text-4xl">
              {project.name}
            </h1>

            <p className="text-center text-lg sm:text-xl">
              By{" "}
              <Link
                href={`/profile/${encodeURIComponent(project.creator_username ?? "")}`}
                className="font-medium underline-offset-4 hover:underline"
              >
                {project.creator_username}
              </Link>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge
                className={cn(
                  "font-normal",
                  projectStatusBadgeClassName(project.status),
                )}
              >
                {project.status}
              </Badge>

              {project.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className={cn("font-normal", projectTagBadgeClassName(tag))}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100">
          <div className="responsiveContainer flex flex-col gap-6 py-10">
            <h2 className="font-din text-2xl font-semibold">Description</h2>

            <p className="whitespace-pre-wrap text-lg text-neutral-800">
              {project.description?.trim()
                ? project.description.trim()
                : "No description provided yet."}
            </p>

            {projectReadme ? (
              <pre className="whitespace-pre-wrap font-sans text-sm text-neutral-800">
                {projectReadme}
              </pre>
            ) : (
              <p>No README available.</p>
            )}
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
