import { eq } from 'drizzle-orm';
import { db } from '../db';
import { habitEntries } from '../db/schema';
import { HabitEntrieNotFoundError } from '../errors/habit-entrie-not-found-error';
import { HabitNotFoundError } from '../errors/habit-not-found-error';
import { UpdateFailedError } from '../errors/update-failed-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { getHabitEntriesById } from './get-habit-entrie-by-id';

interface UpdateHabitEntrieInput {
  habitEntrieId: string;
  userId: string;
  habitId: string;
  entryDate: string;
  completed: boolean;
  createdAt: Date;
}

export async function updateHabitEntrie({
  habitEntrieId,
  habitId,
  userId,
  completed,
  createdAt,
  entryDate,
}: UpdateHabitEntrieInput) {
  if (!habitId) throw new HabitNotFoundError(habitId);
  if (!userId) throw new UserNotFoundError('Usuário não autenticado');

  const { entrie } = await getHabitEntriesById({ habitEntrieId });

  if (!entrie) throw new HabitEntrieNotFoundError(habitId);

  const [updated] = await db
    .update(habitEntries)
    .set({
      habitId,
      userId,
      completed,
      createdAt,
      entryDate,
    })
    .where(eq(habitEntries.id, habitEntrieId))
    .returning();

  if (!updated) throw new UpdateFailedError('Habit entrie', habitId);

  return {
    habit: updated,
  };
}
