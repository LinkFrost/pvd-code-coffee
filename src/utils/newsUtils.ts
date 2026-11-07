import { z } from "zod";

export const newsPostStatuses = ["published", "unpublished"] as const;
export const newsPostCategories = ["Events", "Tech Brew", "News"] as const;

export const newsPostStatusSchema = z.enum(newsPostStatuses);
export const newsPostCategorySchema = z.enum(newsPostCategories);

export const newsPostContentSchema = z.object({
  title: z.string().trim().min(1, "A title is required").max(200),
  category: newsPostCategorySchema,
  short_description: z
    .string()
    .trim()
    .min(1, "A short description is required")
    .max(500),
  content: z.string().trim().min(1, "Post content is required").max(65_000),
});

export type NewsPostStatus = (typeof newsPostStatuses)[number];
export type NewsPostCategory = (typeof newsPostCategories)[number];

export const newsPostStatusLabels: Record<NewsPostStatus, string> = {
  published: "Published",
  unpublished: "Unpublished",
};

export const newsPostStatusBadgeClasses: Record<NewsPostStatus, string> = {
  published:
    "border-transparent bg-blue-600 text-white hover:bg-blue-600/90 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-600/90",
  unpublished:
    "border-transparent bg-red-600 text-white hover:bg-red-600/90 dark:bg-red-600 dark:text-white dark:hover:bg-red-600/90",
};

export const newsPostCategoryBadgeClasses: Record<NewsPostCategory, string> = {
  Events:
    "border-amber-300 bg-amber-100 text-amber-900 dark:border-amber-700 dark:bg-amber-950/60 dark:text-amber-200",
  "Tech Brew":
    "border-sky-300 bg-sky-100 text-sky-900 dark:border-sky-700 dark:bg-sky-950/60 dark:text-sky-200",
  News: "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200",
};
