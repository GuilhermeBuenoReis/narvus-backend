import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { HabitEntrieNotFoundError } from '../errors/habit-entrie-not-found-error';
import { makeHabitEntrie } from '../test/factories/habit-entrie';
import { findHabitEntrieById } from './find-habit-entrie-by-id';

describe('find habit entrie by id service', () => {
  it('should be able to find habit entrie by id', async () => {
    const { habitId, id, completed, createdAt, entryDate, userId } =
      await makeHabitEntrie();

    const result = await findHabitEntrieById({ habitEntrieId: id });

    expect(result).toEqual({
      habitEntrie: {
        id,
        completed,
        createdAt,
        entryDate,
        userId,
        habitId,
      },
    });
  });

  it('should throw an error if habit entrie is not found', async () => {
    const fakeHabitEntrieId = faker.string.uuid();
    await expect(
      findHabitEntrieById({
        habitEntrieId: fakeHabitEntrieId,
      })
    ).rejects.toBeInstanceOf(HabitEntrieNotFoundError);
  });
});
