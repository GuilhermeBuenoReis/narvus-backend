import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { habits } from './habits';
import { users } from './user';

export const habitEntries = pgTable(
  'habit_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    habitId: uuid('habit_id')
      .notNull()
      .references(() => habits.id, { onDelete: 'cascade' }),
    entryDate: date('entry_date').notNull(),
    completed: boolean('completed').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  table => [
    uniqueIndex('unique_entry_idx').on(
      table.userId,
      table.habitId,
      table.entryDate
    ),
  ]
);

export const habitEntriesRelations = relations(habitEntries, ({ one }) => ({
  user: one(users, {
    fields: [habitEntries.userId],
    references: [users.id],
  }),
  habit: one(habits, {
    fields: [habitEntries.habitId],
    references: [habits.id],
  }),
}));
