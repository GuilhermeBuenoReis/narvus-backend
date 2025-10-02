import dayjs from 'dayjs';
import { z } from 'zod';
import { db } from '../db';
import { schema } from '../db/schema';
import { HabitNotFoundError } from '../errors/habit-not-found-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { findHabitById } from './find-habit-by-id';
import { findUserById } from './find-user-by-id';

const createHabitEntrieSchema = z.object({
  userId: z.uuid({ version: 'v4' }),
  habitId: z.uuid({ version: 'v4' }),
  entryDate: z.coerce.date().optional(),
  completed: z.boolean().default(false),
});

type CreateHabitEntrieInput = z.infer<typeof createHabitEntrieSchema>;

export async function createHabitEntrie({
  userId,
  habitId,
  entryDate,
  completed,
}: CreateHabitEntrieInput) {
  const normalizedDate = dayjs(entryDate).format('YYYY-MM-DD');

  const userFound = await findUserById({ userId });

  if (!userFound.user) {
    throw new UserNotFoundError(userId);
  }

  const { id: userFoundId } = userFound.user;

  const habitFound = await findHabitById({
    habitId,
    userId: userFoundId,
  });

  if (!habitFound.habit) {
    throw new HabitNotFoundError(habitId);
  }

  const { id: habitFoundId } = habitFound.habit;

  const [result] = await db
    .insert(schema.habitEntries)
    .values({
      userId: userFoundId,
      habitId: habitFoundId,
      entryDate: normalizedDate,
      completed,
    })
    .returning()
    .onConflictDoUpdate({
      target: [
        schema.habitEntries.userId,
        schema.habitEntries.habitId,
        schema.habitEntries.entryDate,
      ],
      set: { completed: completed ?? false },
    });

  const habitEntrie = result;

  return {
    habitEntrie,
  };
}
