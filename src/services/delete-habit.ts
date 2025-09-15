import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { habits } from '../db/schema';
import { HabitNotFoundError } from '../errors/habit-not-found-error';

const deleteHabitSchema = z.object({
  habitId: z.uuid({ version: 'v4' }),
});

type DeleteHabitInput = z.infer<typeof deleteHabitSchema>;

export async function deleteHabit({ habitId }: DeleteHabitInput) {
  const result = await db
    .delete(habits)
    .where(eq(habits.id, habitId))
    .returning();

  if (result.length === 0) {
    throw new HabitNotFoundError(habitId);
  }

  return {
    success: true,
  };
}
