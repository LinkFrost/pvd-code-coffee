"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { ProjectTagsCombobox } from "~/components/projects/ProjectTagsCombobox";
import {
  DEFAULT_PROJECT_TAG_SUGGESTIONS,
  PROJECT_STATUSES,
  type ProjectStatus,
} from "~/lib/projects";
import { api } from "~/trpc/react";
import { Spinner } from "../ui/spinner";
import { Pencil } from "lucide-react";

type NameStatus = "idle" | "checking" | "available" | "taken";

type EditProjectDialogProps = {
  project: {
    id: number;
    name: string;
    description: string | null;
    project_url: string | null;
    tags: string[];
    status: ProjectStatus;
  };
};

export function EditProjectDialog({ project }: EditProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [nameStatus, setNameStatus] = useState<NameStatus>("idle");

  const router = useRouter();
  const utils = api.useUtils();

  const updateProject = api.projects.updateProject.useMutation({
    onSuccess: (_data, variables) => {
      setOpen(false);
      setNameStatus("idle");
      void utils.projects.getProjectByName.invalidate();
      const nextName = variables.name?.trim();
      if (nextName !== undefined && nextName !== project.name) {
        router.push(`/projects/${encodeURIComponent(nextName)}`);
      } else {
        router.refresh();
      }
    },
  });

  const form = useForm({
    defaultValues: {
      name: project.name,
      description: project.description ?? "",
      project_url: project.project_url ?? "",
      tags: project.tags.length > 0 ? project.tags : ([] as string[]),
      status: project.status,
    },
    onSubmit: async ({ value }) => {
      const isAvailable = await utils.projects.isProjectNameAvailable.fetch({
        name: value.name.trim(),
        excludeProjectId: project.id,
      });

      if (!isAvailable) {
        setNameStatus("taken");
        return;
      }

      await updateProject.mutateAsync({
        projectId: project.id,
        name: value.name.trim(),
        description: value.description.trim(),
        project_url: value.project_url.trim() || null,
        tags: value.tags,
        status: value.status,
      });
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          form.reset({
            name: project.name,
            description: project.description ?? "",
            project_url: project.project_url ?? "",
            tags: project.tags.length > 0 ? project.tags : [],
            status: project.status,
          });
          setNameStatus("idle");
        } else {
          form.reset();
        }
        setOpen(nextOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Pencil className="h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Edit project</DialogTitle>

          <DialogDescription>
            Update your project details. The GitHub repository link cannot be
            changed here.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();

            if (document.activeElement instanceof HTMLElement) {
              document.activeElement.blur();
            }

            void form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0
                  ? "Project name is required."
                  : undefined,
              onSubmit: ({ value }) =>
                value.trim().length === 0
                  ? "Project name is required."
                  : undefined,
            }}
          >
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="editProjectName">Project Name</Label>

                <Input
                  id="editProjectName"
                  name={field.name}
                  value={field.state.value}
                  onChange={(event) => {
                    field.handleChange(event.target.value);
                    setNameStatus("idle");
                  }}
                  onBlur={async (event) => {
                    field.handleBlur();

                    const name = event.target.value.trim();

                    if (!name) return;

                    setNameStatus("checking");

                    const isAvailable =
                      await utils.projects.isProjectNameAvailable.fetch({
                        name,
                        excludeProjectId: project.id,
                      });

                    setNameStatus(isAvailable ? "available" : "taken");
                  }}
                />

                {nameStatus === "taken" && (
                  <p className="text-sm text-red-600">
                    Project name is already taken.
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="description">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="editProjectDescription">Description</Label>

                <Textarea
                  id="editProjectDescription"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  rows={4}
                />
              </div>
            )}
          </form.Field>

          <form.Field name="project_url">
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="editProjectUrl">
                  Project URL{" "}
                  <span className="font-normal text-neutral-500">
                    (optional)
                  </span>
                </Label>

                <Input
                  id="editProjectUrl"
                  name={field.name}
                  type="text"
                  placeholder="https://"
                  autoComplete="off"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </div>
            )}
          </form.Field>

          <form.Field
            name="tags"
            validators={{
              onChange: ({ value }) =>
                value.length < 1 ? "Select at least one tag." : undefined,
              onSubmit: ({ value }) =>
                value.length < 1 ? "Select at least one tag." : undefined,
            }}
          >
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="editProjectTags">Tags</Label>

                <ProjectTagsCombobox
                  id="editProjectTags"
                  inModalDialog
                  options={DEFAULT_PROJECT_TAG_SUGGESTIONS}
                  value={field.state.value}
                  onChange={(next) => field.handleChange(next)}
                  placeholder="Search tags…"
                />
                {field.state.meta.errors[0] && (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
                <p className="text-xs text-neutral-500">
                  Choose one or more tags from the list.
                </p>
              </div>
            )}
          </form.Field>

          <form.Field
            name="status"
            validators={{
              onChange: ({ value }) =>
                !PROJECT_STATUSES.includes(value as ProjectStatus)
                  ? "Select a status."
                  : undefined,
              onSubmit: ({ value }) =>
                !PROJECT_STATUSES.includes(value as ProjectStatus)
                  ? "Select a status."
                  : undefined,
            }}
          >
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="editProjectStatus">Status</Label>

                <Select
                  value={field.state.value}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) {
                      field.handleBlur();
                    }
                  }}
                  onValueChange={(v) =>
                    field.handleChange(v as (typeof PROJECT_STATUSES)[number])
                  }
                >
                  <SelectTrigger id="editProjectStatus" name={field.name}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent>
                    {PROJECT_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.state.meta.errors[0] && (
                  <p className="text-sm text-red-600">
                    {field.state.meta.errors[0]}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <DialogFooter className="gap-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting,
                tags: state.values.tags,
                status: state.values.status,
              })}
            >
              {({ isSubmitting, tags, status }) => (
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    tags.length < 1 ||
                    !PROJECT_STATUSES.includes(status) ||
                    nameStatus === "taken" ||
                    nameStatus === "checking"
                  }
                  variant="cncDefault"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                  {(isSubmitting || nameStatus === "checking") && <Spinner />}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
