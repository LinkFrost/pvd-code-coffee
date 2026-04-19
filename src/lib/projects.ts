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
  "JavaScript",
  "Java",
  "Go",
  "Rust",
  "Python",
  "AI/ML",
  "Mobile",
  "Swift",
  "Kotlin",
  "Flutter",
  "Groovy",
  "React Native",
  "React",
  "Vue",
  "Svelte",
  "Solid.js",
  "Nuxt.js",
  "Tanstack Start",
  "Next.js",
  "API",
  "Spring Boot",
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
  /** JavaScript #F7DF1E */
  JavaScript:
    "border-yellow-400 bg-[#F7DF1E] text-neutral-900 dark:border-yellow-500 dark:bg-[#F7DF1E] dark:text-neutral-950",
  /** Java #ED8B00 / Duke */
  Java: "border-orange-400 bg-[#ED8B00] text-white dark:border-orange-500 dark:bg-[#ED8B00] dark:text-white",
  /** Go gopher blue #00ADD8 */
  Go: "border-cyan-400 bg-[#00ADD8] text-white dark:border-cyan-500 dark:bg-[#00ADD8] dark:text-white",
  /** Rust orange */
  Rust: "border-orange-500/60 bg-orange-500 text-white dark:border-orange-600 dark:bg-orange-600 dark:text-white",
  /** Python blue ~#3776AB */
  Python:
    "border-[#2e5f8a] bg-[#3776AB] text-white dark:bg-[#3776AB] dark:text-white",
  "AI/ML":
    "border-emerald-300 bg-emerald-100 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-200",
  Mobile:
    "border-neutral-500 bg-neutral-600 text-white dark:border-neutral-600 dark:bg-neutral-600 dark:text-white",
  /** Swift #F05138 */
  Swift:
    "border-orange-400 bg-[#F05138] text-white dark:border-orange-500 dark:bg-[#F05138] dark:text-white",
  /** Kotlin #7F52FF */
  Kotlin:
    "border-violet-400 bg-[#7F52FF] text-white dark:border-violet-500 dark:bg-[#7F52FF] dark:text-white",
  /** Flutter #02569B / #54C5F8 */
  Flutter:
    "border-sky-500 bg-[#02569B] text-white dark:border-sky-600 dark:bg-[#02569B] dark:text-white",
  /** Groovy ~#4298B8 */
  Groovy:
    "border-teal-400 bg-[#4298B8] text-white dark:border-teal-500 dark:bg-[#4298B8] dark:text-white",
  /** React Native — React cyan family */
  "React Native":
    "border-cyan-400 bg-[#61DAFB] text-neutral-900 dark:border-cyan-500 dark:bg-[#61DAFB] dark:text-neutral-950",
  /** React cyan ~#61DAFB */
  React:
    "border-cyan-400 bg-[#61DAFB] text-neutral-900 dark:border-cyan-500 dark:bg-[#61DAFB] dark:text-neutral-950",
  /** Vue #42B883 */
  Vue: "border-emerald-400 bg-[#42B883] text-white dark:border-emerald-500 dark:bg-[#42B883] dark:text-white",
  /** Svelte #FF3E00 */
  Svelte:
    "border-orange-400 bg-[#FF3E00] text-white dark:border-orange-500 dark:bg-[#FF3E00] dark:text-white",
  /** Solid.js #446b9e */
  "Solid.js":
    "border-blue-500 bg-[#446b9e] text-white dark:border-blue-600 dark:bg-[#446b9e] dark:text-white",
  /** Nuxt #00DC82 */
  "Nuxt.js":
    "border-emerald-400 bg-[#00DC82] text-neutral-900 dark:border-emerald-500 dark:bg-[#00DC82] dark:text-neutral-950",
  /** TanStack — warm amber / brand */
  "Tanstack Start":
    "border-amber-400 bg-amber-500 text-neutral-950 dark:border-amber-500 dark:bg-amber-600 dark:text-neutral-950",
  /** Next.js mark — near-black */
  "Next.js":
    "border-neutral-800 bg-neutral-950 text-white dark:border-neutral-700 dark:bg-black dark:text-white",
  API: "border-neutral-200 bg-neutral-100 text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200",
  /** Spring Boot #6DB33F */
  "Spring Boot":
    "border-green-500 bg-[#6DB33F] text-white dark:border-green-600 dark:bg-[#6DB33F] dark:text-white",
  /** Distinct from Live (blue-600) and Python */
  "Open Source":
    "border-indigo-500/70 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-600 dark:text-white",
} as const satisfies Record<
  (typeof DEFAULT_PROJECT_TAG_SUGGESTIONS)[number],
  string
>;

export function projectStatusBadgeClassName(status: ProjectStatus): string {
  return PROJECT_STATUS_BADGE_CLASSES[status];
}

export function projectTagBadgeClassName(tag: string): string {
  const key = tag.trim();
  const mapped =
    PROJECT_TAG_BADGE_CLASSES[key as keyof typeof PROJECT_TAG_BADGE_CLASSES];
  if (mapped) {
    return mapped;
  }
  return "border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-200";
}
