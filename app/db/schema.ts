import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todoTable = sqliteTable("todo", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title"),
  task: text("task"),
  done: integer("done", { mode: "boolean" }).default(false),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});
