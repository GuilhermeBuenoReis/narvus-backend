import { faker } from '@faker-js/faker';
import type { InferSelectModel } from 'drizzle-orm';
import { db } from '../../db';
import { habits } from '../../db/schema';
import { makeUser } from './user';

export async function makeHabit(
  override: Partial<InferSelectModel<typeof habits>> = {}
) {
  const userId = override.userId ?? (await makeUser()).id;

  const [row] = await db
    .insert(habits)
    .values({
      userId: userId,
      title: faker.lorem.sentence({ min: 3, max: 7 }),
      description: faker.lorem.paragraph(),
      frequency: faker.helpers.arrayElement(['daily', 'weekly', 'monthly']),
      startsDate: faker.date.past({ years: 1 }).toISOString().slice(0, 10),
      ...override,
    })
    .returning();

  return row;
}
