# Plan: Project filters (`getProjects` + Projects page UI)

## Goal

Replace `getAllProjects` with a generic `getProjects` procedure that supports optional filters (tags with **OR** semantics, **single** status, name search), **sorting** (create date, update date, or name alphabetically), and add a search bar plus collapsible tag/status/sort controls on the Projects page.

---

## 1. Router: `getAllProjects` → `getProjects`

### Input (Zod), all optional

- **`search`** — string (trimmed). Empty string means “no search.”
- **`tags`** — `string[]`. **OR semantics:** a project matches if **any** of its tags is in this list (intersection of selected tag chips with the project’s tag set is non-empty when multiple tags are selected). If the array is empty or omitted, do not filter by tags.
- **`status`** — **single** optional value: one of `In Development` | `Live` | `Inactive` (aligned with `PROJECT_STATUSES`). Omit or null means “any status.” **Not** a multi-select.
- **`sort`** — **required** default or optional with a default in API:
  - **`updated_on`** — newest / oldest by `updated_on` (match current product default: typically **desc** = most recently updated first).
  - **`created_on`** — by `created_on` (specify asc vs desc in enum, e.g. `created_on_desc` / `created_on_asc`, or a pair `sortBy` + `sortDir`; see below).

Practical shape options:

- **`sortBy`:** `updated_on` | `created_on` | `name`
- **`sortDir`:** `asc` | `desc`  

Defaults: e.g. `sortBy: updated_on`, `sortDir: desc` to preserve today’s list behavior.

### Behavior

- When no **filters** are set (search, tags, status), still return all rows subject to **sort**.
- Apply filters in SQL (same query shape: join `projects` + `users`), adding `WHERE` only for provided filters.
- Apply **`ORDER BY`** according to `sortBy` + `sortDir`. For `name`, order by `projects.name` (case-insensitive if DB supports it consistently).

### Implementation

- One `publicProcedure.query` with a `z.object({ ... })` where filter fields are optional and sort fields have defaults.
- Remove `getAllProjects` after migrating callers, or keep a thin alias to `getProjects({})` during transition (optional).

---

## 2. Search by name

### Goal

User types a substring; match `projects.name` (optionally `description` later).

### SQL

- Use `LIKE` with a bounded pattern, e.g. case-insensitive match on name:
  - Prefer `LOWER(name) LIKE LOWER(...)` or DB-specific `ILIKE` if available.

### Safety

- Parameterize values; do not concatenate raw user input into SQL.
- If using `LIKE`, escape `%` and `_` in user input or restrict allowed characters.

### Performance

- `LIKE '%term%'` does not use a normal B-tree index well; acceptable at modest scale.
- Later: full-text index or prefix-only search if needed.

### Scope

- Start with **name only**; extend to description in the same procedure if desired.

---

## 3. Tags filter logic

### Storage

- Tags live in a JSON string column; app uses `parseProjectTags` today.

### Options

- **A — SQL (preferred at scale):** Use SingleStore JSON functions to test tag membership (confirm syntax for your version).
- **B — Application filter (short-term):** Fetch with other SQL filters, then filter rows in JS by parsed tags. Simpler but worse if result sets grow.

### Semantics (locked in)

- **OR filters:** if the user selects tags `[A, B]`, include projects that have tag **A** **or** tag **B** (or both).

---

## 4. Status filter

- **Single value:** `WHERE projects.status = :status` when `status` is provided; otherwise omit the clause.

---

## 5. Sorting

- **`updated_on`:** `ORDER BY projects.updated_on ASC|DESC`.
- **`created_on`:** `ORDER BY projects.created_on ASC|DESC`.
- **`name`:** `ORDER BY` project name alphabetically; use case-insensitive collation or `LOWER(name)` if needed for stable UX.

Expose the three dimensions (field + direction) via the `sortBy` / `sortDir` (or equivalent enum) described in section 1.

---

## 6. Frontend (Projects page)

### Stack

- Use **shadcn/ui** components already in the project; add any missing primitives with:

  ```bash
  pnpm dlx shadcn@latest add [package-name]
  ```

  Examples you may need: `input`, `button`, `popover`, `command` (for combobox), `select`, `badge`, `checkbox` (for tag toggles), etc. — add only what the chosen layout requires.

### Layout

1. **Row 1:** “All Projects” heading + **New Project** when signed in (existing).
2. **Row 2:** Search row — text input + **Search** button at the end (and/or Enter to submit). Prefer shadcn **Input** + **Button**, composed per existing patterns.
3. **Next to** the search row: a **Filters** control that toggles visibility of the collapsible row.
4. **Row 3 (collapsible):**
   - **Tags:** multi-select / chips / checkbox list — selected tags form the **OR** set passed to `getProjects`.
   - **Status:** **single** selection — e.g. shadcn **Select** or **RadioGroup** (or one row of mutually exclusive options), plus an explicit “Any” / cleared state.
   - **Sort:** control for **created date**, **updated date**, and **alphabetical (name)**, each with **asc/desc** as applicable (e.g. Select for field + Select for direction, or one combined control).

### State & data fetching

- Local state: `searchQuery`, `selectedTags` (`string[]`), `selectedStatus` (single value or `null`), `sortBy`, `sortDir`, `filtersOpen`.
- Call `getProjects` with the current input object (client tRPC or RSC + hydration — match how the page already loads data).
- Optional: mirror in **URL search params** for shareable URLs.

### UX

- Debounce is optional if search is **explicit** (button/Enter only).
- “Clear filters” when any filter/sort deviation from defaults is active.
- Distinct empty states: no projects in DB vs no matches for filters.

---

## 7. Migration

1. Implement `getProjects` + migrate all `getAllProjects` call sites.
2. Remove deprecated procedure name once unused.
3. Grep for `getAllProjects` in the repo and fix.

---

## 8. Suggested implementation order

1. Router input schema: filters + `sortBy` / `sortDir`, SQL + ORDER BY, manual verification.
2. Wire Projects page to `getProjects`.
3. UI: shadcn primitives (add via `pnpm dlx shadcn@latest add …` as needed), search bar, filters toggle, tags (OR), status (single), sort controls.
4. (Optional) URL sync for filters and sort.

---

## Quick reference

| Concern      | Recommendation                                                                 |
|-------------|-----------------------------------------------------------------------------------|
| Name search | `LIKE`, case-insensitive, parameterized                                           |
| Tags        | **OR** — project matches if it has any selected tag                               |
| Status      | **Single** value or “any”                                                         |
| Sort        | `updated_on` \| `created_on` \| `name`, each with `asc` \| `desc`                 |
| UI          | shadcn components; `pnpm dlx shadcn@latest add [package-name]` for new primitives |
| Layout      | Search + Search button + Filters toggle; collapsible row for tags, status, sort  |

---

## How plan documents work in Cursor (and similar tools)

- **What they are:** Markdown (or text) files in the repo — **documentation for humans and agents**, not executable config.
- **Not auto-run:** Cursor does **not** run or enforce plan files automatically. Nothing “executes” the plan unless you or the agent follows it.
- **How to use them:**
  - **Reference in chat:** `@.cursor/plans/project-filters.md` (or drag the file) so the model loads the plan when implementing.
  - **Rules vs plans:** `.cursor/rules/*.mdc` files are **injected as persistent guidance** when matched. Plan files in `.cursor/plans/` are **opt-in** — you reference them when needed so they don’t clutter every conversation.
  - **Execution:** You implement step-by-step, or ask Agent mode to “implement according to @project-filters.md.”
- **Good habits:** Keep plans **versioned in git**, update them when scope changes, and treat them as the **source of truth** for “what we agreed to build” alongside issues or PRs.

This file lives at: `.cursor/plans/project-filters.md`.
