# PVD Code & Coffee

## Purpose

Originally, we wanted to create a simple website to act as a landing page with information about PVD Code & Coffee. The plan was for us to create a basic SSR website using Astro.js, so that people interested in learning more about this chapter of Code & Coffee could have a one stop resource to see event information, links to contact our organizers, etc.

However, one of the main things we like to provide at PVD Code & Coffee is an environment where people can showcase projects they are working on. Whether its to teach about a topic, showcase something they’re proud of, or to ideate with other people, community member’s side projects is something we take great interest in highlighting.

Therefore, when announcing that we were building a site during one of our events, a few people chipped in with the idea of allowing the website to be a place where all members can showcase projects they are working one. This turned out to be a fantastic idea that resonated with the community.

Thus began the idea to have a community showcase feature be the defining trait of the website. We ditched Astro in favor of Next.js via the T3 stack, and the rest is history.

## Tech stack

PVD Code & Coffee is a full-stack TypeScript application built with the Next.js
App Router. It uses tRPC for the application API, SingleStore for persistent
data, Clerk for authentication, and Meetup's GraphQL API for event data.

| Area           | Technology                                        |
| -------------- | ------------------------------------------------- |
| Application    | Next.js 15, React 18, TypeScript                  |
| API            | tRPC 11, Zod, SuperJSON                           |
| Client data    | TanStack Query                                    |
| Database       | SingleStore, Drizzle ORM, `mysql2`                |
| Authentication | Clerk                                             |
| Events         | Meetup GraphQL API, `graphql-request`             |
| Content        | MDXEditor, React Markdown, Remark GFM, Rehype Raw |
| UI             | Tailwind CSS, Radix UI, Base UI, Lucide icons     |
| Tooling        | pnpm, ESLint, Prettier, Drizzle Kit               |

The server API is split into routers for Meetup events, users, projects, news,
and Clerk webhooks. These routers are registered in
`src/server/api/root.ts`. Server components call the API directly, while client
components use tRPC with TanStack Query.

## Getting started

### Prerequisites

- Node.js
- pnpm 9.5 or a compatible version
- A SingleStore database
- A Clerk application
- Access to the Meetup GraphQL API

### Installation

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

3. Replace the example values with credentials for SingleStore, Clerk, and
   Meetup. See [Environment variables](#environment-variables) for the required
   configuration.

4. Apply the database schema:

   ```bash
   pnpm db:push
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000).

### Environment variables

Environment variables are validated in `src/env.js`. Empty strings are treated
as missing values.

#### Database

| Variable               | Description                                     |
| ---------------------- | ----------------------------------------------- |
| `DATABASE_URL`         | Database URL required by the environment schema |
| `SINGLESTORE_HOST`     | SingleStore host                                |
| `SINGLESTORE_PORT`     | SingleStore port                                |
| `SINGLESTORE_USER`     | SingleStore user                                |
| `SINGLESTORE_PASSWORD` | SingleStore password                            |
| `SINGLESTORE_DB_NAME`  | SingleStore database name                       |

The application and Drizzle Kit connect with the individual `SINGLESTORE_*`
values over SSL. Tables are prefixed with the current `NODE_ENV`, so development
and production can share a database without sharing tables. For example, the
users table is named `development_users` locally and `production_users` in
production.

#### Clerk

| Variable                            | Description                                  |
| ----------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public Clerk key used by the browser         |
| `CLERK_SECRET_KEY`                  | Secret Clerk key used by the server          |
| `CLERK_SIGNING_SECRET`              | Signing secret used to verify Clerk webhooks |

The Clerk application also needs:

- GitHub enabled as an OAuth provider for project imports.
- A session token customization that exposes `metadata.role`.
- A webhook targeting `/api/webhooks` and subscribed to `user.created`,
  `user.updated`, and `user.deleted`.

#### Meetup

| Variable                  | Description                               |
| ------------------------- | ----------------------------------------- |
| `MEETUP_GRAPHQL_ENDPOINT` | Endpoint used for Meetup GraphQL requests |

#### Runtime

`NODE_ENV` is read by the app and determines the database table prefix. Next.js
sets it automatically in normal development and production workflows.

> The current `.env.example` contains an older PostgreSQL-style
> `DATABASE_URL` example and does not yet list every variable above. Use
> `src/env.js` as the source of truth until the example file is updated.

### Available scripts

| Command             | Description                               |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Run the development server with Turbopack |
| `pnpm build`        | Create a production build                 |
| `pnpm start`        | Start the production server               |
| `pnpm preview`      | Build and start the production server     |
| `pnpm check`        | Run ESLint and TypeScript checks          |
| `pnpm lint`         | Run ESLint                                |
| `pnpm lint:fix`     | Run ESLint and apply fixes                |
| `pnpm typecheck`    | Run TypeScript without emitting files     |
| `pnpm format:check` | Check formatting with Prettier            |
| `pnpm format:write` | Format supported files with Prettier      |
| `pnpm db:generate`  | Generate Drizzle migrations               |
| `pnpm db:migrate`   | Apply generated Drizzle migrations        |
| `pnpm db:push`      | Push the schema directly to the database  |
| `pnpm db:studio`    | Open Drizzle Studio                       |

## Meetup integration

Meetup is the source of truth for events. Event records are fetched at request
time through the Meetup GraphQL API and are not copied into SingleStore.

The Meetup router in `src/server/api/routers/meetup.ts`:

- Fetches the next upcoming event.
- Fetches the six most recent past events.
- Resolves an individual event by its Meetup id.
- Resolves a title-based website route to a Meetup event.
- Maps Meetup data into the event shape used by the UI, including its time,
  venue, RSVP count, image, description, and external event URL.

The home page displays the next event and recent past events.
`/events/[eventTitle]` provides an event detail page. Calls to action link back
to Meetup, where attendance and RSVPs are managed. This website does not create,
edit, or persist Meetup events.

The Meetup group URL name is currently configured in the Meetup router. Change
that constant if the site is repurposed for another Meetup group.

## Accounts and Clerk

Clerk owns authentication and the primary identity record. The application
keeps a synchronized local user record so accounts can be associated with
profiles, projects, and news posts.

### User synchronization

Clerk sends user lifecycle events to `POST /api/webhooks`. The route verifies
the request with `CLERK_SIGNING_SECRET` before processing it.

- `user.created` inserts the Clerk id, name, email address, username, and image.
- `user.updated` updates those synchronized fields.
- `user.deleted` removes the corresponding local user.

Profile biographies are stored only in SingleStore and are not overwritten by
Clerk webhook updates.

### Profiles

Public profiles are available at `/profile/[username]`. A profile displays the
member's account information and projects. The profile UI offers biography
editing when the profile belongs to the signed-in Clerk account.

### Roles and authorization

The application recognizes three roles:

- `member`
- `author`
- `admin`

Roles are read from `sessionClaims.metadata.role`. They must be assigned through
Clerk public metadata and included in the session token. They are not stored in
the local users table.

Authors and administrators can access the news editor. Authors can manage their
own posts, while administrators can manage every post. The current admin
dashboard and social media routes are restricted to administrators but remain
placeholder pages.

Clerk middleware runs across application and API routes. Explicit matchers for
profiles, projects, and events ensure authentication is still available when a
dynamic route contains a dot that could otherwise look like a static filename.

## Projects

Projects allow signed-in members to share work from their GitHub accounts. The
project catalog and detail pages are publicly viewable.

### Creating and managing a project

Clerk's GitHub OAuth connection is used to obtain an access token and load the
signed-in user's repositories from the GitHub API. A project stores:

- The owner and GitHub repository id
- The repository URL
- An optional deployed project URL
- A unique project name
- A description
- One or more tags
- A status
- Created and updated timestamps

Supported statuses are `In Development`, `Live`, and `Inactive`. Project names
must be unique because they are used in the detail-page URL.

The project creation UI is available to signed-in members whose local account
has a username. Project updates validate the signed-in Clerk account against
the project's local owner before changing data.

### Browsing projects

`/projects` provides a searchable and filterable catalog. Visitors can filter
by tags and status and sort by updated date, created date, or name.

`/projects/[projectName]` displays the project details. If a GitHub repository
URL is present, the server fetches its README through the GitHub API and caches
the response for one hour. A member's projects also appear on their public
profile.

## News

News posts are stored in SingleStore and support draft and published workflows.
Only published posts appear in public feeds and public detail queries.

### Public news

- The home page displays the latest published posts.
- `/news` provides search, category filters, and sorting.
- `/news/[postTitle]` displays an individual article.

Posts can use the `Events`, `Tech Brew`, or `News` category. Their body content
is authored as Markdown and rendered with GitHub-flavored Markdown support.

### Authoring and publishing

The news editor uses MDXEditor and is available to users with the `author` or
`admin` role:

- `/news/editor` creates posts and lists manageable posts.
- `/news/editor/[postId]` edits an existing post.

Posts can be `unpublished` or `published`. Authors can create posts and manage
only posts they own. Administrators can manage posts from any author. Titles
must be unique because they are used in public article URLs.

Each post contains a title, category, short description, Markdown body, author,
publication status, and created and updated timestamps.

## Data model

The Drizzle schema is defined in `src/server/db/schema.ts` and contains three
primary tables:

- `users` stores Clerk-linked account and profile data.
- `projects` stores member projects and GitHub references.
- `news_posts` stores authored Markdown posts and publishing state.

The tables use indexed Clerk ids, usernames, project names, GitHub ids, post
titles, publication statuses, and timestamps for common lookup and feed
operations.

## Application routes

| Route                     | Purpose                                      | Access                             |
| ------------------------- | -------------------------------------------- | ---------------------------------- |
| `/`                       | Upcoming event, latest news, and past events | Public                             |
| `/about`                  | Organization and organizer information       | Public                             |
| `/events/[eventTitle]`    | Meetup event details                         | Public                             |
| `/projects`               | Project catalog and project creation         | Public; sign-in required to create |
| `/projects/[projectName]` | Project details and repository README        | Public; owner required to edit     |
| `/profile/[username]`     | Member profile and projects                  | Public; owner required to edit     |
| `/news`                   | Published news feed                          | Public                             |
| `/news/[postTitle]`       | Published article                            | Public                             |
| `/news/editor`            | Create and manage news posts                 | Author or admin                    |
| `/news/editor/[postId]`   | Edit a news post                             | Owning author or admin             |
| `/admin/dashboard`        | Placeholder administration page              | Admin                              |
| `/admin/social-media`     | Placeholder social media page                | Admin                              |
| `/api/trpc/[trpc]`        | tRPC HTTP endpoint                           | Procedure-dependent                |
| `/api/webhooks`           | Clerk user synchronization webhook           | Signed Clerk webhook               |

## Project structure

```text
src/
├── app/                 # Next.js routes, layouts, and route handlers
├── components/          # Feature and reusable UI components
├── server/
│   ├── api/             # tRPC context, procedures, and routers
│   ├── auth/            # Server-side authorization helpers
│   ├── db/              # Drizzle connection and schema
│   └── lib/             # Server-only integrations
├── trpc/                # Server and React tRPC clients
└── utils/               # Shared schemas, constants, and utilities
```

Database migration files and snapshots are stored in `drizzle/`, and Drizzle
Kit is configured in `drizzle.config.ts`.
