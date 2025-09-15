import { describe, expect, it } from 'vitest';
import { HabitNotFoundError } from '../errors/habit-not-found-error';
import { makeHabit } from '../test/factories/habit';
import { findHabitById } from './find-habit-by-id';

describe('find habit by id service', () => {
  it('should be able to find habit by id', async () => {
    const { id, title, description, frequency, startsDate, userId } =
      await makeHabit();

    const result = await findHabitById({ habitId: id, userId });

    expect(result).toEqual({
      habit: {
        id,
        title,
        description,
        frequency,
        startsDate,
        userId,
      },
    });
  });

  it('should throw an error if habit is not found', async () => {
    await expect(
      findHabitById({
        habitId: 'df6ffe1a-c613-4f28-9323-049dd8ebe432',
        userId: 'b4a829c9-07ae-4ddd-88e6-c9c60ab2aa6f',
      })
    ).rejects.toBeInstanceOf(HabitNotFoundError);
  });
});
