import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { HabitNotFoundError } from '../errors/habit-not-found-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { makeHabit } from '../test/factories/habit';
import { makeUser } from '../test/factories/user';
import { createHabitEntrie } from './create-habit-entrie';

describe('create habit entrie service', () => {
  it('should be able to create a habit entrie', async () => {
    const user = await makeUser();
    const habit = await makeHabit({ userId: user.id });

    const result = await createHabitEntrie({
      userId: user.id,
      habitId: habit.id,
      entryDate: faker.date.recent(),
      completed: faker.datatype.boolean(),
    });

    const { id, userId, habitId, entryDate, completed, createdAt } =
      result.habitEntrie;

    expect(result).toEqual({
      habitEntrie: {
        id,
        userId,
        habitId,
        entryDate,
        completed,
        createdAt,
      },
    });
  });

  it('should not be able to create a habit entrie with an invalid user id', async () => {
    const invalidUserId = faker.string.uuid();
    const habit = await makeHabit();

    await expect(() =>
      createHabitEntrie({
        userId: invalidUserId,
        habitId: habit.id,
        entryDate: faker.date.recent(),
        completed: faker.datatype.boolean(),
      })
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('should not be able to create a habit entrie with an invalid habit id', async () => {
    const invalidHabitId = faker.string.uuid();
    const user = await makeUser();

    await expect(() =>
      createHabitEntrie({
        habitId: invalidHabitId,
        userId: user.id,
        entryDate: faker.date.recent(),
        completed: faker.datatype.boolean(),
      })
    ).rejects.toBeInstanceOf(HabitNotFoundError);
  });
});
