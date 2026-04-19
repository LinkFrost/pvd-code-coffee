import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

import {
  type ProjectStatus,
  projectStatusBadgeClassName,
  projectTagBadgeClassName,
} from "~/lib/projects";
import { cn } from "~/lib/twUtils";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { formatDate } from "~/lib/dates";

type ProjectCardProps = {
  name: string | null;
  description: string | null;
  projectUrl?: string | null;
  githubUrl: string | null;
  creatorName: string;
  createdOn: Date;
  updatedOn: Date;
  tags: string[];
  status: ProjectStatus;
};

const VISIBLE_TAGS = 3;

export function ProjectCard({
  name,
  description,
  projectUrl,
  githubUrl,
  creatorName,
  createdOn,
  updatedOn,
  tags,
  status,
}: ProjectCardProps) {
  const projectName = name ?? "Untitled Project";

  const projectHref = `/projects/${encodeURIComponent(projectName)}`;

  const previewDescription =
    description?.trim() && description.length > 120
      ? `${description.slice(0, 120)}...`
      : (description?.trim() ?? "No description yet.");

  const shownTags = tags.slice(0, VISIBLE_TAGS);
  const extraCount = Math.max(0, tags.length - VISIBLE_TAGS);
  const trimmedProjectUrl = projectUrl?.trim() ?? "";

  return (
    <Card className="relative h-full transition-shadow hover:shadow-md">
      <CardHeader>
        <Link href={projectHref} aria-label={`Open ${projectName}`}>
          <CardTitle className="font-din text-2xl hover:text-accentRed">
            {projectName}
          </CardTitle>
        </Link>

        <CardDescription>
          Built by <span className="font-medium">{creatorName}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-neutral-700">{previewDescription}</p>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex w-full items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
            {shownTags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className={cn("font-normal", projectTagBadgeClassName(tag))}
              >
                {tag}
              </Badge>
            ))}

            {extraCount > 0 && (
              <Badge variant="secondary" className="font-normal">
                +{extraCount}
              </Badge>
            )}
          </div>

          <Badge
            className={cn(
              "shrink-0 font-normal",
              projectStatusBadgeClassName(status),
            )}
          >
            {status}
          </Badge>
        </div>

        <div className="flex w-full items-end justify-between gap-4">
          <div className="space-y-1 text-xs text-neutral-500">
            <p>Created: {formatDate(createdOn)}</p>

            <p>Updated: {formatDate(updatedOn)}</p>
          </div>

          <div className="relative z-20 flex items-center gap-3">
            {trimmedProjectUrl.length > 0 && (
              <Link
                href={trimmedProjectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-blue-600"
              >
                <ExternalLink className="h-6 w-6" />
                <span className="sr-only">Open project site</span>
              </Link>
            )}

            {githubUrl && (
              <Link
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-600 hover:text-blue-600"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Link>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
