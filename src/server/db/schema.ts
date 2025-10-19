import {
  int,
  text,
  index,
  singlestoreTableCreator,
  bigint,
  timestamp,
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

export const users_table = createTable("users", {
  id: int("id").primaryKey().autoincrement(),
  clerk_id: text(),
  first_name: text(),
  last_name: text(),
  email_address: text(),
  username: text(),
});
