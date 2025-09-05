import { faker } from '@faker-js/faker';
import type { InferSelectModel } from 'drizzle-orm';
import { db } from '../../db';
import { habitEntries, type habits } from '../../db/schema';
import { makeHabit } from './habit';
import { makeUser } from './user';

export async function makeHabitEntrie(
  override: Partial<InferSelectModel<typeof habits>> = {}
) {
  const userId = override.userId ?? (await makeUser()).id;
  const habitId = override.id ?? (await makeHabit()).id;

  const [row] = await db
    .insert(habitEntries)
    .values({
      userId: userId,
      habitId: habitId,
      entryDate: faker.date.past({ years: 1 }).toISOString().slice(0, 10),
      completed: faker.datatype.boolean(),
      ...override,
    })
    .returning();

  return row;
}
