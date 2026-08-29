"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ListFilter, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { NewsPostCard } from "~/components/news/NewsPostCard";
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
import { api } from "~/trpc/react";
import { cn } from "~/utils/tailwindUtils";

type UrlNewsFilters = {
  appliedSearch: string;
  sortBy: "updated_on" | "created_on" | "title";
  sortDir: "asc" | "desc";
};

const DEFAULT_SORT_BY: UrlNewsFilters["sortBy"] = "updated_on";
const DEFAULT_SORT_DIR: UrlNewsFilters["sortDir"] = "desc";

const parseSearchParams = (searchParams: URLSearchParams): UrlNewsFilters => {
  const appliedSearch = searchParams.get("q")?.trim() ?? "";
  const sort = searchParams.get("sort");
  const sortBy =
    sort === "created_on" || sort === "title" || sort === "updated_on"
      ? sort
      : DEFAULT_SORT_BY;
  const direction = searchParams.get("dir");
  const sortDir =
    direction === "asc" || direction === "desc" ? direction : DEFAULT_SORT_DIR;

  return { appliedSearch, sortBy, sortDir };
};

const serializeFilters = (filters: UrlNewsFilters) => {
  const params = new URLSearchParams();

  if (filters.appliedSearch.trim()) {
    params.set("q", filters.appliedSearch.trim());
  }

  if (filters.sortBy !== DEFAULT_SORT_BY) {
    params.set("sort", filters.sortBy);
  }

  if (filters.sortDir !== DEFAULT_SORT_DIR) {
    params.set("dir", filters.sortDir);
  }

  return params.toString();
};

export function NewsFeed() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = useMemo(
    () => parseSearchParams(searchParams),
    [searchParams],
  );
  const [searchDraft, setSearchDraft] = useState(filters.appliedSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setSearchDraft(filters.appliedSearch);
  }, [filters.appliedSearch]);

  const replaceFilters = useCallback(
    (patch: Partial<UrlNewsFilters>) => {
      const next = { ...filters, ...patch };
      const queryString = serializeFilters(next);
      const href = queryString ? `${pathname}?${queryString}` : pathname;

      router.replace(href, { scroll: false });
    },
    [filters, pathname, router],
  );

  const queryInput = useMemo(
    () => ({
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
      ...(filters.appliedSearch ? { search: filters.appliedSearch } : {}),
    }),
    [filters],
  );
  const {
    data: posts = [],
    isLoading,
    isError,
  } = api.news.getPublishedPosts.useQuery(queryInput);

  const applySearch = useCallback(() => {
    replaceFilters({ appliedSearch: searchDraft.trim() });
  }, [replaceFilters, searchDraft]);

  const hasActiveFilters =
    filters.appliedSearch.length > 0 ||
    filters.sortBy !== DEFAULT_SORT_BY ||
    filters.sortDir !== DEFAULT_SORT_DIR;

  const clearFilters = () => {
    setSearchDraft("");
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by post title or description…"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applySearch();
              }
            }}
            className="bg-white sm:min-w-0 sm:flex-1"
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
            filtersOpen && "bg-neutral-100 text-neutral-900",
          )}
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
        >
          <ListFilter className="size-4" />
          Filters
        </Button>
      </div>

      {filtersOpen && (
        <div className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-neutral-50/80 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Sort by</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(value) =>
                  replaceFilters({
                    sortBy: value as UrlNewsFilters["sortBy"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="updated_on">Last updated</SelectItem>
                  <SelectItem value="created_on">Created</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Order</Label>
              <Select
                value={filters.sortDir}
                onValueChange={(value) =>
                  replaceFilters({
                    sortDir: value as UrlNewsFilters["sortDir"],
                  })
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

          {hasActiveFilters && (
            <div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1 text-neutral-600"
                onClick={clearFilters}
              >
                <X className="size-4" />
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-neutral-600">
          <Spinner className="size-8" />
          <span>Loading news…</span>
        </div>
      ) : isError ? (
        <p className="text-xl text-neutral-600">
          The news feed could not be loaded right now.
        </p>
      ) : posts.length === 0 ? (
        <p className="text-xl text-neutral-600">
          {hasActiveFilters
            ? "No news posts match your search or filters."
            : "No news posts have been published yet."}
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <NewsPostCard
              key={post.id}
              title={post.title}
              shortDescription={post.short_description}
              authorUsername={post.author_username}
              createdOn={post.created_on}
              updatedOn={post.updated_on}
            />
          ))}
        </div>
      )}
    </div>
  );
}
