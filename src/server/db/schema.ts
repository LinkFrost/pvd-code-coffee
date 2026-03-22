import {
  int,
  bigint,
  text,
  timestamp,
  index,
  singlestoreTableCreator,
} from "drizzle-orm/singlestore-core";
import { env } from "~/env";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = singlestoreTableCreator(
  (name) => `${env.NODE_ENV}_${name}`,
);

export const users_table = createTable(
  "users",
  {
    id: int("id").primaryKey().autoincrement(),
    clerk_id: text(),
    first_name: text(),
    last_name: text(),
    email_address: text(),
    username: text(),
    image_url: text(),
    bio: text(),
  },
  (table) => [
    index("clerk_id_index").on(table.clerk_id),
    index("username_index").on(table.username),
  ],
);

export const projects_table = createTable(
  "projects",
  {
    id: int("id").primaryKey().autoincrement(),
    user_id: bigint({ mode: "bigint" }),
    github_id: int("github_id"),
    github_url: text(),
    project_url: text(),
    name: text(),
    description: text(),
    tags: text().notNull().default("[]"),
    status: text().notNull().default("In Development"),
    created_on: timestamp("created_on", { mode: "date" }).notNull(),
    updated_on: timestamp("updated_on", { mode: "date" }).notNull(),
  },
  (table) => [
    index("user_id_index").on(table.user_id),
    index("github_id_index").on(table.github_id),
    index("name_index").on(table.name),
  ],
);
