import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { HabitNotFoundError } from '../errors/habit-not-found-error';
import { makeUser } from '../test/factories/user';
import { createHabit } from './create-habit';
import { deleteHabit } from './delete-habit';
import { findHabitById } from './find-habit-by-id';

enum frequencyEnum {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
}

describe('delete habit', () => {
  it('should be able to delete a habit', async () => {
    const user = await makeUser();
    const created = await createHabit({
      userId: user.id,
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      frequency: frequencyEnum.daily,
    });

    const result = await deleteHabit({ habitId: created.habit.id });

    expect(result).toEqual({ success: true });

    await expect(
      findHabitById({
        habitId: created.habit.id,
        userId: user.id,
      })
    ).rejects.toThrow(HabitNotFoundError);
  });
});
