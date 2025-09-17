import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { DeleteFailedError } from '../errors/delete-failed-error';
import { HabitEntrieNotFoundError } from '../errors/habit-entrie-not-found-error';
import { makeHabit } from '../test/factories/habit';
import { makeHabitEntrie } from '../test/factories/habit-entrie';
import { deleteHabitEntrie } from './delete-habit-entrie';
import { findHabitEntrieById } from './find-habit-entrie-by-id';

describe('deleteHabitEntrie', () => {
  it('should delete a habit entry successfully', async () => {
    const habit = await makeHabit();
    const habitEntrie = await makeHabitEntrie({ habitId: habit.id });

    const result = await deleteHabitEntrie({ habitEntrieId: habit.id });

    expect(result).toEqual({ success: true });

    await expect(
      findHabitEntrieById({ habitEntrieId: habitEntrie.id })
    ).rejects.toThrow(HabitEntrieNotFoundError);
  });

  it('should throw DeleteFailedError when trying to delete non-existing entry', async () => {
    const fakeHabitId = faker.string.uuid();

    await expect(
      deleteHabitEntrie({ habitEntrieId: fakeHabitId })
    ).rejects.toThrow(DeleteFailedError);
  });

  it('should throw HabitNotFoundError when habitId is empty', async () => {
    await expect(deleteHabitEntrie({ habitEntrieId: '' })).rejects.toThrow(
      HabitEntrieNotFoundError
    );
  });
});
