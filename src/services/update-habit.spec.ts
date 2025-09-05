import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { HabitNotFoundError } from '../errors/habit-not-found';
import { UserNotFoundError } from '../errors/user-not-found';
import { makeUser } from '../test/factories/user';
import { createHabit } from './create-habit';
import { updateHabit } from './update-habit';

enum frequencyEnum {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
}

describe('update habit service', () => {
  it('should be able to update a habit', async () => {
    const user = await makeUser();

    const created = await createHabit({
      userId: user.id,
      title: faker.lorem.words(3),
      description: faker.lorem.sentence(),
      frequency: frequencyEnum.daily,
    });

    const newTitle = faker.lorem.words(4);
    const newDescription = faker.lorem.paragraph();
    const newFrequency = frequencyEnum.weekly;
    const newStartsDate = new Date();

    const result = await updateHabit({
      habitId: created.habit.id,
      userId: user.id,
      title: newTitle,
      description: newDescription,
      frequency: newFrequency,
      startsDate: newStartsDate,
    });

    expect(result).toEqual({
      habit: {
        id: created.habit.id,
        userId: user.id,
        title: newTitle,
        description: newDescription,
        frequency: newFrequency,
        startsDate: newStartsDate.toISOString().split('T')[0],
      },
    });
  });

  it('should throw UserNotFoundError if userId is invalid', async () => {
    const user = await makeUser();
    const created = await createHabit({
      userId: user.id,
      title: faker.lorem.words(3),
      frequency: frequencyEnum.daily,
    });

    const fakeUserId = faker.string.uuid();

    await expect(
      updateHabit({
        habitId: created.habit.id,
        userId: fakeUserId,
        title: faker.lorem.words(4),
        description: created.habit.description ?? undefined,
        frequency: created.habit.frequency as frequencyEnum,
        startsDate: new Date(),
      })
    ).rejects.toBeInstanceOf(UserNotFoundError);
  });

  it('should throw HabitNotFoundError if habitId is invalid', async () => {
    const user = await makeUser();

    await expect(
      updateHabit({
        habitId: faker.string.uuid(),
        userId: user.id,
        title: faker.lorem.words(4),
        description: faker.lorem.sentence(),
        frequency: frequencyEnum.weekly,
        startsDate: new Date(),
      })
    ).rejects.toBeInstanceOf(HabitNotFoundError);
  });
});
