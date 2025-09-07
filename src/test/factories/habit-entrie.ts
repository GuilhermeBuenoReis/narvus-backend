import { faker } from '@faker-js/faker';
import type { InferInsertModel } from 'drizzle-orm';
import { db } from '../../db';
import { habitEntries } from '../../db/schema';
import { makeHabit } from './habit';
import { makeUser } from './user';

export async function makeHabitEntrie(
  override: Partial<InferInsertModel<typeof habitEntries>> = {}
) {
  let userId = override.userId;
  let habitId = override.habitId;

  if (!userId) {
    const user = await makeUser();
    userId = user.id;
  }

  if (!habitId) {
    const habit = await makeHabit({ userId });
    habitId = habit.id;
  }

  const [row] = await db
    .insert(habitEntries)
    .values({
      userId,
      habitId,
      entryDate: faker.date.past({ years: 1 }).toISOString().slice(0, 10),
      completed: faker.datatype.boolean(),
      ...override,
    })
    .returning();

  return row;
}
