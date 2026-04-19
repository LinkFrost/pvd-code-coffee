"use client";

import { useMemo, useState } from "react";
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

type NameStatus = "idle" | "checking" | "available" | "taken";

export function NewProjectDialog({ username }: { username: string }) {
  const [open, setOpen] = useState(false);
  const [nameStatus, setNameStatus] = useState<NameStatus>("idle");

  const router = useRouter();

  const utils = api.useUtils();

  const createProject = api.projects.createProject.useMutation({
    onSuccess: () => {
      setOpen(false);
      setNameStatus("idle");
      router.refresh();
    },
  });

  const userReposQuery = api.projects.getUserGithubRepos.useQuery(undefined, {
    enabled: open,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const githubRepos = userReposQuery.data ?? [];
  const isReposLoading = userReposQuery.isLoading || userReposQuery.isFetching;

  const repoMap = useMemo(
    () =>
      new Map(
        (userReposQuery.data ?? []).map((repo) => [String(repo.id), repo]),
      ),
    [userReposQuery.data],
  );

  const form = useForm({
    defaultValues: {
      repoId: "",
      name: "",
      description: "",
      project_url: "",
      github_id: 0,
      github_url: "",
      tags: [] as string[],
      status: "In Development" as (typeof PROJECT_STATUSES)[number],
    },
    onSubmit: async ({ value }) => {
      const selectedRepo = repoMap.get(value.repoId);

      if (!selectedRepo) {
        return;
      }

      const isAvailable = await utils.projects.isProjectNameAvailable.fetch({
        name: value.name.trim(),
      });

      if (!isAvailable) {
        setNameStatus("taken");
        return;
      }

      await createProject.mutateAsync({
        username,
        github_id: selectedRepo.id,
        github_url: selectedRepo.html_url,
        name: value.name,
        description: value.description,
        project_url: value.project_url.trim() || undefined,
        tags: value.tags,
        status: value.status,
      });
    },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        form.reset();

        setOpen(nextOpen);

        if (!nextOpen) {
          setNameStatus("idle");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="cncDefault">New Project</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>

          <DialogDescription>
            Choose a GitHub repository to create your project from, and enter
            additional details below.
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
            name="repoId"
            validators={{
              onChange: ({ value }) =>
                value.trim().length === 0
                  ? "Please select a repository."
                  : undefined,
              onSubmit: ({ value }) =>
                value.trim().length === 0
                  ? "Please select a repository."
                  : undefined,
            }}
          >
            {(field) => (
              <div className="grid gap-2">
                <Label htmlFor="repoId">GitHub Repository</Label>

                <Select
                  value={field.state.value}
                  disabled={isReposLoading || githubRepos.length === 0}
                  onOpenChange={(isOpen) => {
                    if (!isOpen) {
                      field.handleBlur();
                    }
                  }}
                  onValueChange={(repoId) => {
                    field.handleChange(repoId);

                    const selectedRepo = repoMap.get(repoId);

                    if (!selectedRepo) return;

                    form.setFieldValue("name", selectedRepo.name);
                    form.setFieldValue(
                      "description",
                      selectedRepo.description ?? "",
                    );
                    form.setFieldValue("github_id", selectedRepo.id);
                    form.setFieldValue("github_url", selectedRepo.html_url);

                    setNameStatus("idle");
                  }}
                >
                  <SelectTrigger id="repoId" name={field.name}>
                    <SelectValue
                      placeholder={
                        isReposLoading
                          ? "Loading repositories..."
                          : githubRepos.length === 0
                            ? "No repositories found"
                            : "Select a repository"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {githubRepos.map((repo) => (
                      <SelectItem key={repo.id} value={String(repo.id)}>
                        {repo.name}
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

          <form.Subscribe selector={(state) => state.values.repoId}>
            {(repoId) =>
              repoId ? (
                <div className="space-y-4">
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
                        <Label htmlFor="projectName">Project Name</Label>

                        <Input
                          id="projectName"
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
                              await utils.projects.isProjectNameAvailable.fetch(
                                { name },
                              );

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
                        <Label htmlFor="projectDescription">Description</Label>

                        <Textarea
                          id="projectDescription"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          rows={4}
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field name="project_url">
                    {(field) => (
                      <div className="grid gap-2">
                        <Label htmlFor="projectUrl">
                          Project URL{" "}
                          <span className="font-normal text-neutral-500">
                            (optional)
                          </span>
                        </Label>

                        <Input
                          id="projectUrl"
                          name={field.name}
                          type="text"
                          placeholder="https://"
                          autoComplete="off"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />
                      </div>
                    )}
                  </form.Field>

                  <form.Field
                    name="tags"
                    validators={{
                      onChange: ({ value }) =>
                        value.length < 1
                          ? "Select at least one tag."
                          : undefined,
                      onSubmit: ({ value }) =>
                        value.length < 1
                          ? "Select at least one tag."
                          : undefined,
                    }}
                  >
                    {(field) => (
                      <div className="grid gap-2">
                        <Label htmlFor="projectTags">Tags</Label>

                        <ProjectTagsCombobox
                          id="projectTags"
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
                        <Label htmlFor="projectStatus">Status</Label>

                        <Select
                          value={field.state.value}
                          onOpenChange={(isOpen) => {
                            if (!isOpen) {
                              field.handleBlur();
                            }
                          }}
                          onValueChange={(v) =>
                            field.handleChange(
                              v as (typeof PROJECT_STATUSES)[number],
                            )
                          }
                        >
                          <SelectTrigger id="projectStatus" name={field.name}>
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
                </div>
              ) : null
            }
          </form.Subscribe>

          <DialogFooter className="gap-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting,
                repoId: state.values.repoId,
                tags: state.values.tags,
                status: state.values.status,
              })}
            >
              {({ isSubmitting, repoId, tags, status }) => (
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !repoId ||
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
