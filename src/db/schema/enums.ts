import { pgEnum } from "drizzle-orm/pg-core";

export const habitFrequencyEnum = pgEnum("habit_frequency", [
	"daily",
	"weekly",
]);
