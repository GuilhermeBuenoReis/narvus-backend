import { eq } from 'drizzle-orm';
import { db } from '../db';
import { schema } from '../db/schema';
import { DeleteFailedError } from '../errors/delete-failed-error';
import { HabitNotFoundError } from '../errors/habit-not-found-error';

interface DeleteHabitInput {
  habitId: string;
}

export async function deleteHabit({ habitId }: DeleteHabitInput) {
  if (!habitId) throw new HabitNotFoundError(habitId);

  const result = await db
    .delete(schema.habits)
    .where(eq(schema.habits.id, habitId))
    .returning();

  if (result.length === 0) {
    throw new DeleteFailedError('habit', habitId);
  }

  return {
    success: true,
  };
}
