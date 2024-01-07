import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text, integer, unique } from 'drizzle-orm/sqlite-core';

export const todoTable = sqliteTable('todo', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title'),
  task: text('task'),
  done: integer('done', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`)
});

export const userTable = sqliteTable(
  'user',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    createdAt: text('created_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: text('updated_at')
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),

    name: text('name'),
    email: text('email').notNull(),
    imageUrl: text('image_url')
  },
  (table) => {
    return {
      userEmailKey: unique('user_email_unique_key').on(table.email)
    };
  }
);

export const workplaceTable = sqliteTable('workplace', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name'),
  createdAt: text('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: text('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  userId: integer('user_id')
    .references(() => userTable.id)
    .notNull()
});

export const usersRelations = relations(userTable, ({ many }) => ({
  workplaces: many(workplaceTable)
}));

export const workplaceRelations = relations(workplaceTable, ({ one }) => ({
  owner: one(userTable, {
    fields: [workplaceTable.userId],
    references: [userTable.id]
  })
}));
