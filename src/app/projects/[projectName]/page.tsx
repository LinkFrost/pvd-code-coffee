import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { EditProjectDialog } from "~/components/projects/EditProjectDialog";
import { Badge } from "~/components/ui/badge";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/utils/tailwindUtils";
import {
  projectStatusBadgeClassName,
  projectTagBadgeClassName,
} from "~/utils/projectUtils";
import { ProjectReadmeAccordion } from "~/components/projects/ProjectReadmeAccordion";
import { fetchProjectReadme } from "~/server/lib/githubUtils";
import { api, apiResult, HydrateClient } from "~/trpc/server";
import { Button } from "~/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

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

  const session = await auth();

  const canEdit = Boolean(
    session.userId &&
      project.creator_clerk_id &&
      session.userId === project.creator_clerk_id,
  );

  const ProjectReadme = async ({
    githubUrl,
  }: {
    githubUrl: string | null | undefined;
  }) => {
    const readme = await fetchProjectReadme(githubUrl);

    if (!readme) {
      return <p>No README available.</p>;
    }

    return <ProjectReadmeAccordion readme={readme} />;
  };

  return (
    <HydrateClient>
      <div className="flex flex-col justify-center align-middle">
        <section className="bg-accent">
          <div className="responsiveContainer flex flex-col gap-6 py-12 sm:py-16">
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="break-words text-center font-din text-3xl font-bold md:text-4xl">
                {project.name}
              </h1>

              <p className="text-center text-lg sm:text-xl">
                By{" "}
                <Link
                  href={`/profile/${encodeURIComponent(project.creator_username ?? "")}`}
                  className="font-medium hover:text-accentRed"
                >
                  {project.creator_username}
                </Link>
              </p>
            </div>

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

            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Button variant="default">
                  <Link
                    href={project.project_url ?? ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Project Link
                  </Link>
                </Button>

                <Button variant="default">
                  <Link
                    href={project.github_url ?? ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </Link>
                </Button>

                {canEdit && (
                  <EditProjectDialog
                    project={{
                      id: project.id,
                      name: project.name ?? "",
                      description: project.description,
                      project_url: project.project_url,
                      tags: project.tags,
                      status: project.status,
                    }}
                  />
                )}
              </div>
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

            <Suspense
              fallback={
                <div className="flex items-center gap-2 text-neutral-500">
                  <Spinner className="size-5" />
                  <span>Loading README...</span>
                </div>
              }
            >
              <ProjectReadme githubUrl={project.github_url} />
            </Suspense>
          </div>
        </section>
      </div>
    </HydrateClient>
  );
}
