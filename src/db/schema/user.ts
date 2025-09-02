import { relations } from 'drizzle-orm';
import { pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { habitEntries } from './habit-entries';
import { habitStacks } from './habit-stacks';
import { habitStats } from './habit-stats';
import { habits } from './habits';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 512 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  habits: many(habits),
  habitEntries: many(habitEntries),
  habitStacks: many(habitStacks),
  habitStats: many(habitStats),
}));
