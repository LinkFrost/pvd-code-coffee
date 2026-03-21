import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Github } from "lucide-react";

type ProjectCardProps = {
  name: string | null;
  description: string | null;
  githubUrl: string | null;
  creatorName: string;
  createdOn: Date;
  updatedOn: Date;
};

export function ProjectCard({
  name,
  description,
  githubUrl,
  creatorName,
  createdOn,
  updatedOn,
}: ProjectCardProps) {
  const projectName = name ?? "Untitled Project";

  const projectHref = `/projects/${encodeURIComponent(projectName)}`;

  const previewDescription =
    description?.trim() && description.length > 120
      ? `${description.slice(0, 120)}...`
      : (description?.trim() ?? "No description yet.");

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);

  return (
    <Card className="relative h-full transition-shadow hover:shadow-md">
      <Link
        href={projectHref}
        aria-label={`Open ${projectName}`}
        className="absolute inset-0 z-10 rounded-xl"
      />

      <CardHeader>
        <CardTitle className="font-din text-2xl">{projectName}</CardTitle>

        <CardDescription>
          Built by <span className="font-medium">{creatorName}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-neutral-700">{previewDescription}</p>
      </CardContent>

      <CardFooter>
        <div className="flex w-full items-end justify-between gap-4">
          <div className="space-y-1 text-xs text-neutral-500">
            <p>Created: {formatDate(createdOn)}</p>
            <p>Updated: {formatDate(updatedOn)}</p>
          </div>

          {githubUrl && (
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative z-20 text-neutral-600 hover:text-blue-600"
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
