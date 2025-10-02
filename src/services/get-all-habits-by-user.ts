import { eq } from 'drizzle-orm';
import z from 'zod';
import { db } from '../db';
import { schema } from '../db/schema';
import { ListHabitsByUserNotFoundError } from '../errors/list-habits--by-user-not-found-error';

const getAllHabitsByUserSchema = z.object({
  userId: z.uuid({ version: 'v4' }),
});

type GetAllHabitsByUserInput = z.infer<typeof getAllHabitsByUserSchema>;

export async function getAllHabitsByUser({ userId }: GetAllHabitsByUserInput) {
  const result = await db
    .select()
    .from(schema.habits)
    .where(eq(schema.habits.userId, userId));

  if (result.length === 0) throw new ListHabitsByUserNotFoundError(userId);

  return {
    habits: result,
  };
}
