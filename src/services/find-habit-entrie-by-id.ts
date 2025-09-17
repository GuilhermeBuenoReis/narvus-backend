import { and, eq } from 'drizzle-orm';
import { db } from '../db';
import { habitEntries } from '../db/schema';
import { HabitEntrieNotFoundError } from '../errors/habit-entrie-not-found-error';

interface FindHabitByIdInput {
  habitEntrieId: string;
}

export async function findHabitEntrieById({
  habitEntrieId,
}: FindHabitByIdInput) {
  const [result] = await db
    .select()
    .from(habitEntries)
    .where(and(eq(habitEntries.id, habitEntrieId)));

  if (!result) throw new HabitEntrieNotFoundError(habitEntrieId);

  const habitEntrie = result;

  return {
    habitEntrie,
  };
}
