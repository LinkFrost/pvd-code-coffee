import { z } from "zod";

export const PROJECT_STATUSES = ["In Development", "Live", "Inactive"] as const;

export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const projectStatusSchema = z.enum(PROJECT_STATUSES);

/** Required on create / when updating tags */
export const projectTagsInputSchema = z
  .array(z.string().trim().min(1))
  .min(1, "Select at least one tag.")
  .max(32);

/**
 * Deserialize `projects.tags` column (JSON array string). Column is non-null;
 * malformed JSON yields an empty list.
 */
export function parseProjectTags(raw: string): string[] {
  if (!raw.trim()) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export function serializeProjectTags(tags: string[]): string {
  const cleaned = tags.map((t) => t.trim()).filter(Boolean);
  return JSON.stringify(cleaned);
}

export const DEFAULT_PROJECT_TAG_SUGGESTIONS = [
  "TypeScript",
  "Rust",
  "CLI",
  "Python",
  "AI/ML",
  "Mobile",
  "React",
  "Next.js",
  "API",
  "Open Source",
] as const;

/** Tailwind classes for status badges (full control; merge with Badge base). */
export const PROJECT_STATUS_BADGE_CLASSES: Record<ProjectStatus, string> = {
  "In Development":
    "border-transparent bg-emerald-600 text-white hover:bg-emerald-600/90 dark:bg-emerald-600 dark:text-white dark:hover:bg-emerald-600/90",
  Live: "border-transparent bg-blue-600 text-white hover:bg-blue-600/90 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-600/90",
  Inactive:
    "border-transparent bg-red-600 text-white hover:bg-red-600/90 dark:bg-red-600 dark:text-white dark:hover:bg-red-600/90",
};

/**
 * Tag badge colors (brand-adjacent hues). Keys must match stored tag strings exactly.
 * Unknown tags fall back to neutral styling via `projectTagBadgeClassName`.
 */
export const PROJECT_TAG_BADGE_CLASSES = {
  /** TypeScript logo ~#3178C6 — light fill + deep blue text */
  TypeScript:
    "border-sky-300 bg-sky-100 text-[#235a97] dark:border-sky-700 dark:bg-sky-950/80 dark:text-sky-200",
  /** Rust orange */
  Rust:
    "border-orange-500/60 bg-orange-500 text-white dark:border-orange-600 dark:bg-orange-600 dark:text-white",
  CLI: "border-neutral-300 bg-neutral-200 text-neutral-800 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100",
  /** Python blue ~#3776AB */
  Python:
    "border-[#2e5f8a] bg-[#3776AB] text-white dark:bg-[#3776AB] dark:text-white",
  "AI/ML":
    "border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200",
  Mobile:
    "border-neutral-500 bg-neutral-600 text-white dark:border-neutral-600 dark:bg-neutral-600 dark:text-white",
  /** React cyan ~#61DAFB */
  React:
    "border-cyan-400 bg-[#61DAFB] text-neutral-900 dark:border-cyan-500 dark:bg-[#61DAFB] dark:text-neutral-950",
  /** Next.js mark — near-black */
  "Next.js":
    "border-neutral-800 bg-neutral-950 text-white dark:border-neutral-700 dark:bg-black dark:text-white",
  API: "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200",
  /** Distinct from Live (blue-600) and Python */
  "Open Source":
    "border-indigo-500/70 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-600 dark:text-white",
} as const satisfies Record<(typeof DEFAULT_PROJECT_TAG_SUGGESTIONS)[number], string>;

export function projectStatusBadgeClassName(status: ProjectStatus): string {
  return PROJECT_STATUS_BADGE_CLASSES[status];
}

export function projectTagBadgeClassName(tag: string): string {
  const key = tag.trim();
  const mapped = PROJECT_TAG_BADGE_CLASSES[key as keyof typeof PROJECT_TAG_BADGE_CLASSES];
  if (mapped) {
    return mapped;
  }
  return "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200";
}
