import { relations } from "drizzle-orm";
import { date, integer, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { habits } from "./habits";
import { users } from "./user";

export const habitStats = pgTable("habit_stats", {
	id: uuid("id").defaultRandom().primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	habitId: uuid("habit_id")
		.notNull()
		.references(() => habits.id, { onDelete: "cascade" })
		.unique(),
	currentStreak: integer("current_streak").default(0).notNull(),
	longestStreak: integer("longest_streak").default(0).notNull(),
	lastCompletedDate: date("last_completed_date"),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const habitStatsRelations = relations(habitStats, ({ one }) => ({
	user: one(users, {
		fields: [habitStats.userId],
		references: [users.id],
	}),
	habit: one(habits, {
		fields: [habitStats.habitId],
		references: [habits.id],
	}),
}));
