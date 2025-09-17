import { eq } from 'drizzle-orm';
import { db } from '../db';
import { habitEntries } from '../db/schema';
import { HabitEntrieNotFoundError } from '../errors/habit-entrie-not-found-error';
import { findHabitEntrieById } from './find-habit-entrie-by-id';

interface GetHabitEntriesByIdRequest {
  habitEntrieId: string;
}

export async function getHabitEntriesById({
  habitEntrieId,
}: GetHabitEntriesByIdRequest) {
  const { habitEntrie } = await findHabitEntrieById({ habitEntrieId });
  if (!habitEntrie) throw new HabitEntrieNotFoundError(habitEntrieId);

  const [result] = await db
    .select()
    .from(habitEntries)
    .where(eq(habitEntries.id, habitEntrieId));

  const entrie = result;

  return {
    entrie,
  };
}
