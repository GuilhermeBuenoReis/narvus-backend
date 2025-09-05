import { eq } from 'drizzle-orm';
import { db } from '../db';
import { habits } from '../db/schema';
import { HabitNotFoundError } from '../errors/habit-not-found';
import { UserNotFoundError } from '../errors/user-not-found';

interface UpdateHabitInput {
  habitId: string;
  userId: string;
  title?: string;
  description?: string;
  frequency?: 'daily' | 'weekly' | 'monthly';
  startsDate?: Date;
}

export async function updateHabit({
  habitId,
  userId,
  title,
  description,
  frequency,
  startsDate,
}: UpdateHabitInput) {
  if (!habitId) throw new HabitNotFoundError(habitId);
  if (!userId) throw new UserNotFoundError('Usuário não autenticado');

  // Busca o hábito primeiro
  const [habit] = await db.select().from(habits).where(eq(habits.id, habitId));

  if (!habit) throw new HabitNotFoundError(habitId);
  if (habit.userId !== userId) throw new UserNotFoundError(userId);

  const [updated] = await db
    .update(habits)
    .set({
      title,
      description,
      frequency,
      startsDate: startsDate
        ? startsDate.toISOString().split('T')[0]
        : undefined,
    })
    .where(eq(habits.id, habitId))
    .returning();

  return { habit: updated };
}
