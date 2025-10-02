import { and, eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '../db';
import { schema } from '../db/schema';
import { HabitNotFoundError } from '../errors/habit-not-found-error';

const findHabitByIdSchema = z.object({
  userId: z.uuid({ version: 'v4' }),
  habitId: z.uuid({ version: 'v4' }),
});

type FindHabitByIdInput = z.infer<typeof findHabitByIdSchema>;

export async function findHabitById({ habitId, userId }: FindHabitByIdInput) {
  const [result] = await db
    .select()
    .from(schema.habits)
    .where(and(eq(schema.habits.id, habitId), eq(schema.habits.userId, userId)));

  if (!result) throw new HabitNotFoundError(habitId);

  const habit = result;

  return {
    habit,
  };
}
