import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { InvalidUserIdError } from '../errors/invalid-user-id-error';
import { makeUser } from '../test/factories/user';
import { createHabit } from './create-habit';

enum frequencyEnum {
  daily = 'daily',
  weekly = 'weekly',
  monthly = 'monthly',
}

describe('create habit service', () => {
  it('should be able to create a habit', async () => {
    const user = await makeUser();

    const result = await createHabit({
      userId: user.id,
      title: faker.lorem.sentence({ min: 3, max: 5 }),
      description: faker.lorem.paragraph(),
      frequency: frequencyEnum.daily,
    });

    const { id, userId, title, description, frequency, startsDate } =
      result.habit;

    expect(result).toEqual({
      habit: {
        id,
        userId,
        title,
        description,
        frequency,
        startsDate,
      },
    });
  });

  it('should not be able to create a habit with an invalid user id', async () => {
    const invalidUserId = faker.string.uuid();

    await expect(() =>
      createHabit({
        userId: invalidUserId,
        title: faker.lorem.sentence(),
        frequency: frequencyEnum.daily,
      })
    ).rejects.toBeInstanceOf(InvalidUserIdError);
  });
});
