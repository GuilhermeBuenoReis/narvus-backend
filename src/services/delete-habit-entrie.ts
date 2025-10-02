import { eq } from 'drizzle-orm';
import { db } from '../db';
import { schema } from '../db/schema';
import { DeleteFailedError } from '../errors/delete-failed-error';
import { HabitEntrieNotFoundError } from '../errors/habit-entrie-not-found-error';

interface DeleteHabitEntrieInput {
  habitEntrieId: string;
}

export async function deleteHabitEntrie({
  habitEntrieId,
}: DeleteHabitEntrieInput) {
  if (!habitEntrieId) throw new HabitEntrieNotFoundError(habitEntrieId);

  const result = await db
    .delete(schema.habitEntries)
    .where(eq(schema.habitEntries.habitId, habitEntrieId))
    .returning();

  if (result.length === 0) {
    throw new DeleteFailedError('habit-entrie', habitEntrieId);
  }

  return {
    success: true,
  };
}
