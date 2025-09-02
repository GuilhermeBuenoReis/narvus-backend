import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { habits } from "./habits";
import { users } from "./user";

export const habitStacks = pgTable("habit_stacks", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	existingHabitId: uuid("existing_habit_id")
		.notNull()
		.references(() => habits.id, {
			onDelete: "cascade",
		}),
	newHabitId: uuid("new_habit_id")
		.notNull()
		.references(() => habits.id, {
			onDelete: "cascade",
		}),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const habitStacksRelations = relations(habitStacks, ({ one }) => ({
	user: one(users, {
		fields: [habitStacks.userId],
		references: [users.id],
	}),
	baseHabit: one(habits, {
		fields: [habitStacks.existingHabitId],
		references: [habits.id],
		relationName: "baseHabit",
	}),
	newHabit: one(habits, {
		fields: [habitStacks.newHabitId],
		references: [habits.id],
		relationName: "newHabit",
	}),
}));
