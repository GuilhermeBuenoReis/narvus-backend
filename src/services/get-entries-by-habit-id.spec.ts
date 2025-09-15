import { describe, expect, it } from 'vitest';
import { HabitNotFoundError } from '../errors/habit-not-found-error';
import { getEntreisByHabitId } from '../services/get-entries-by-habit-id';
import { makeHabit } from '../test/factories/habit';
import { makeHabitEntrie } from '../test/factories/habit-entrie';
import { makeUser } from '../test/factories/user';

describe('get entries by habit id service', () => {
  it('should return entries for an existing habit', async () => {
    const user = await makeUser();
    const habit = await makeHabit({ userId: user.id });

    await makeHabitEntrie({ userId: user.id, habitId: habit.id });
    await makeHabitEntrie({ userId: user.id, habitId: habit.id });

    const result = await getEntreisByHabitId({
      userId: user.id,
      habitId: habit.id,
    });

    expect(result.entries).toHaveLength(2);
    result.entries.forEach(entry => {
      expect(entry.habitId).toBe(habit.id);
      expect(entry.userId).toBe(user.id);
    });
  });

  it('should throw HabitNotFoundError if habit does not exist', async () => {
    const fakeUserId = 'f3e6e7fc-98d6-4e9b-9a84-67b0d5a0c8c3';
    const fakeHabitId = 'b9e6e7fc-98d6-4e9b-9a84-67b0d5a0c8c3';

    await expect(
      getEntreisByHabitId({ userId: fakeUserId, habitId: fakeHabitId })
    ).rejects.toBeInstanceOf(HabitNotFoundError);
  });
});
