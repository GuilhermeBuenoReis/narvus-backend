import { describe, expect, it } from 'vitest';
import { HabitsNotFoundError } from '../errors/habits-not-found';
import { getAllHabitsByUser } from '../services/get-all-habits-by-user';
import { makeHabit } from '../test/factories/habit';

describe('get all habits by user service', () => {
  it('should return the user habits when found', async () => {
    const { id, title, description, frequency, startsDate, userId } =
      await makeHabit();

    const result = await getAllHabitsByUser({ userId });

    expect(result).toEqual({
      habits: [
        {
          id,
          title,
          description,
          frequency,
          startsDate,
          userId,
        },
      ],
    });
  });

  it('should throw HabitsNotFoundError if user has no habits', async () => {
    const fakeUserId = 'f3e6e7fc-98d6-4e9b-9a84-67b0d5a0c8c3';

    await expect(
      getAllHabitsByUser({ userId: fakeUserId })
    ).rejects.toBeInstanceOf(HabitsNotFoundError);
  });
});
