import { relations } from "drizzle-orm";
import { date, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { habitFrequencyEnum } from "./enums";
import { habitEntries } from "./habit-entries";
import { habitStacks } from "./habit-stacks";
import { habitStats } from "./habit-stats";
import { users } from "./user";

export const habits = pgTable("habits", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	title: varchar("title", { length: 256 }).notNull(),
	description: text("description"),
	frequency: habitFrequencyEnum("frequency").default("daily").notNull(),
	startsDate: date("starts_date").defaultNow().notNull(),
});

export const habitsRelations = relations(habits, ({ one, many }) => ({
	user: one(users, {
		fields: [habits.userId],
		references: [users.id],
	}),
	entries: many(habitEntries),
	stats: one(habitStats, {
		fields: [habits.id],
		references: [habitStats.habitId],
	}),
	stacksAsBase: many(habitStacks, { relationName: "baseHabit" }),
	stacksAsNew: many(habitStacks, { relationName: "newHabit" }),
}));
