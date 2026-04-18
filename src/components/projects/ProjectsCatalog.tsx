"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ListFilter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ProjectCard } from "~/components/ProjectCard";
import { ProjectTagsCombobox } from "~/components/projects/ProjectTagsCombobox";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Spinner } from "~/components/ui/spinner";
import {
  DEFAULT_PROJECT_TAG_SUGGESTIONS,
  PROJECT_STATUSES,
  type ProjectStatus,
} from "~/lib/projects";
import { cn } from "~/lib/twUtils";
import { api } from "~/trpc/react";

export type UrlProjectFilters = {
  appliedSearch: string;
  tags: string[];
  status: ProjectStatus | null;
  sortBy: "updated_on" | "created_on" | "name";
  sortDir: "asc" | "desc";
};

const DEFAULT_SORT_BY: UrlProjectFilters["sortBy"] = "updated_on";
const DEFAULT_SORT_DIR: UrlProjectFilters["sortDir"] = "desc";

const parseSearchParams = (
  searchParams: URLSearchParams,
): UrlProjectFilters => {
  const q = searchParams.get("q")?.trim() ?? "";

  const tagsRaw = searchParams.get("tags");
  const tags = tagsRaw
    ? tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const statusRaw = searchParams.get("status");
  const status =
    statusRaw && (PROJECT_STATUSES as readonly string[]).includes(statusRaw)
      ? (statusRaw as ProjectStatus)
      : null;

  const sortRaw = searchParams.get("sort");
  const sortBy =
    sortRaw === "created_on" || sortRaw === "name" || sortRaw === "updated_on"
      ? sortRaw
      : DEFAULT_SORT_BY;

  const dirRaw = searchParams.get("dir");
  const sortDir =
    dirRaw === "asc" || dirRaw === "desc" ? dirRaw : DEFAULT_SORT_DIR;

  return { appliedSearch: q, tags, status, sortBy, sortDir };
};

const serializeFiltersToQueryString = (f: UrlProjectFilters): string => {
  const p = new URLSearchParams();

  if (f.appliedSearch.trim()) {
    p.set("q", f.appliedSearch.trim());
  }
  if (f.tags.length > 0) {
    p.set("tags", f.tags.join(","));
  }
  if (f.status != null) {
    p.set("status", f.status);
  }
  if (f.sortBy !== DEFAULT_SORT_BY) {
    p.set("sort", f.sortBy);
  }
  if (f.sortDir !== DEFAULT_SORT_DIR) {
    p.set("dir", f.sortDir);
  }

  return p.toString();
};

const buildQueryInput = (f: UrlProjectFilters) => {
  return {
    sortBy: f.sortBy,
    sortDir: f.sortDir,
    ...(f.appliedSearch.trim() ? { search: f.appliedSearch.trim() } : {}),
    ...(f.tags.length > 0 ? { tags: f.tags } : {}),
    ...(f.status != null ? { status: f.status } : {}),
  };
};

export function ProjectsCatalog() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams],
  );

  const [searchDraft, setSearchDraft] = useState(filters.appliedSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Keep draft in sync when URL changes (browser back/forward, shared link).
  useEffect(() => {
    setSearchDraft(filters.appliedSearch);
  }, [filters.appliedSearch]);

  const replaceFilters = useCallback(
    (patch: Partial<UrlProjectFilters>) => {
      const next: UrlProjectFilters = { ...filters, ...patch };
      const qs = serializeFiltersToQueryString(next);
      const href = qs ? `${pathname}?${qs}` : pathname;
      router.replace(href, { scroll: false });
    },
    [filters, pathname, router],
  );

  const queryInput = useMemo(() => buildQueryInput(filters), [filters]);

  const {
    data: projects = [],
    isLoading,
    isError,
  } = api.projects.getProjects.useQuery(queryInput);

  const applySearch = useCallback(() => {
    replaceFilters({ appliedSearch: searchDraft.trim() });
  }, [replaceFilters, searchDraft]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.appliedSearch.trim().length > 0 ||
      filters.tags.length > 0 ||
      filters.status != null ||
      filters.sortBy !== DEFAULT_SORT_BY ||
      filters.sortDir !== DEFAULT_SORT_DIR
    );
  }, [filters]);

  const clearFilters = useCallback(() => {
    setSearchDraft("");
    router.replace(pathname, { scroll: false });
  }, [pathname, router]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by project name…"
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applySearch();
              }
            }}
            className="bg-white dark:bg-neutral-950 sm:min-w-0 sm:flex-1"
          />

          <Button
            type="button"
            variant="default"
            className="shrink-0"
            onClick={applySearch}
          >
            Search
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className={cn(
            "shrink-0 gap-2",
            filtersOpen &&
              "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100",
          )}
          onClick={() => setFiltersOpen((o) => !o)}
          aria-expanded={filtersOpen}
        >
          <ListFilter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {filtersOpen && (
        <div className="flex flex-col gap-6 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4 dark:border-neutral-700 dark:bg-neutral-900/40">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex min-w-0 flex-col gap-2 md:col-span-2 lg:col-span-1">
              <Label>Tags</Label>

              <ProjectTagsCombobox
                value={filters.tags}
                onChange={(next) => replaceFilters({ tags: next })}
                options={DEFAULT_PROJECT_TAG_SUGGESTIONS}
                placeholder="Search tags…"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Status</Label>

              <Select
                value={filters.status ?? "any"}
                onValueChange={(v) =>
                  replaceFilters({
                    status: v === "any" ? null : (v as ProjectStatus),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  {PROJECT_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label>Sort by</Label>

                <Select
                  value={filters.sortBy}
                  onValueChange={(v) =>
                    replaceFilters({
                      sortBy: v as "updated_on" | "created_on" | "name",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="updated_on">Last updated</SelectItem>
                    <SelectItem value="created_on">Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label>Order</Label>
                <Select
                  value={filters.sortDir}
                  onValueChange={(v) =>
                    replaceFilters({ sortDir: v as "asc" | "desc" })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {hasActiveFilters && (
            <div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-neutral-600"
                onClick={clearFilters}
              >
                <X className="h-4 w-4" />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-neutral-600">
          <Spinner className="size-8" />
          <span>Loading projects…</span>
        </div>
      ) : isError ? (
        <p className="text-xl text-neutral-600">
          We couldn&apos;t load projects right now. Please try again later.
        </p>
      ) : projects.length === 0 ? (
        <p className="text-xl text-neutral-600">
          {hasActiveFilters
            ? "No projects match your filters. Try adjusting search or filters."
            : "No projects yet. Check back soon, or add your own when you&apos;re signed in."}
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
  );
}
