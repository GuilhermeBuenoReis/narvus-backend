import { describe, expect, it } from 'vitest';
import { HabitNotFoundError } from '../errors/habit-not-found-error';
import { makeUser } from '../test/factories/user';
import { findHabitById } from './find-habit-by-id';
import { findUserByEmail } from './find-user-by-email';

describe('find user by email service', () => {
  it('should be able to find user by email', async () => {
    const { id, email, passwordHash, name, avatarUrl, createdAt, updatedAt } =
      await makeUser();

    const result = await findUserByEmail({ email });

    expect(result).toEqual({
      user: {
        id: id,
        name: name,
        email: email,
        avatarUrl: avatarUrl,
        passwordHash: passwordHash,
        createdAt: createdAt,
        updatedAt: updatedAt,
      },
    });
  });

  it('should throw HabitNotFoundError if user and habit not found', async () => {
    await expect(
      findHabitById({
        habitId: 'df6ffe1a-c613-4f28-9323-049dd8ebe432',
        userId: 'b4a829c9-07ae-4ddd-88e6-c9c60ab2aa6f',
      })
    ).rejects.toThrow(HabitNotFoundError);
  });
});
