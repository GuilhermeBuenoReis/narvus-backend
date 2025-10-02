import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { schema } from '../db/schema';
import { HabitNotFoundError } from '../errors/habit-not-found-error';
import { findHabitById } from './find-habit-by-id';

const getHabitEntriesById = z.object({
  habitId: z.uuid({ version: 'v4' }),
  userId: z.uuid({ version: 'v4' }),
});

type GetHabitEntriesByIdInput = z.infer<typeof getHabitEntriesById>;

export async function getEntreisByHabitId({
  userId,
  habitId,
}: GetHabitEntriesByIdInput) {
  const habitFound = await findHabitById({ habitId, userId });

  if (!habitFound.habit.id) {
    throw new HabitNotFoundError(habitId);
  }

  const result = await db
    .select()
    .from(schema.habitEntries)
    .where(eq(schema.habitEntries.habitId, habitId));

  const entries = result;

  return {
    entries,
  };
}
