import { z } from "zod";

export const newsPostStatuses = ["published", "unpublished"] as const;

export const newsPostStatusSchema = z.enum(newsPostStatuses);

export const newsPostContentSchema = z.object({
  title: z.string().trim().min(1, "A title is required").max(200),
  short_description: z
    .string()
    .trim()
    .min(1, "A short description is required")
    .max(500),
  content: z.string().trim().min(1, "Post content is required").max(65_000),
});

export type NewsPostStatus = (typeof newsPostStatuses)[number];

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
