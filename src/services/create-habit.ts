import { z } from 'zod';
import { db } from '../db';
import { habits } from '../db/schema';
import { InvalidUserIdError } from '../errors/invalid-user-id';
import { findUserById } from './find-user-by-id';

export const createHabitInputSchema = z.object({
  userId: z.uuid(),
  title: z.string().min(3),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  startsDate: z.date().optional(),
});

export type CreateHabitInput = z.infer<typeof createHabitInputSchema>;

export async function createHabit({
  title,
  description,
  frequency,
  startsDate,
  userId,
}: CreateHabitInput) {
  const userFound = await findUserById({ userId });

  if (!userFound?.user) {
    throw new InvalidUserIdError(userId);
  }

  const dateToInsert = (startsDate ?? new Date()).toISOString().slice(0, 10);

  const [habit] = await db
    .insert(habits)
    .values({
      userId: userFound.user.id,
      title,
      description,
      frequency,
      startsDate: dateToInsert,
    })
    .returning();

  return { habit };
}
