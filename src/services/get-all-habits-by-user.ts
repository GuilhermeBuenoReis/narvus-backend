import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '../db';
import { habits } from '../db/schema';
import { HabitsNotFoundError } from '../errors/habits-not-found';

const getAllHabitsByUserSchema = z.object({
  userId: z.uuid({ version: 'v4' }),
});

type GetAllHabitsByUserInput = z.infer<typeof getAllHabitsByUserSchema>;

export async function getAllHabitsByUser({ userId }: GetAllHabitsByUserInput) {
  const result = await db
    .select()
    .from(habits)
    .where(eq(habits.userId, userId));

  if (result.length === 0) throw new HabitsNotFoundError(userId);

  return {
    habits: result,
  };
}
