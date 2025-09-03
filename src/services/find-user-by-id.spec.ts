import { describe, expect, it } from 'vitest';
import { makeUser } from '../test/factories/user';
import { findUserById } from './find-user-by-id';

describe('find user by id service', () => {
  it('should be able to find user by id', async () => {
    const { id, email, passwordHash, name, avatarUrl, createdAt, updatedAt } =
      await makeUser();

    const result = await findUserById({ userId: id });

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

  it('should return null if user not found', async () => {
    const result = await findUserById({
      userId: '7d767daf-440a-41d4-baac-e100844a9aa1',
    });

    expect(result).toEqual({
      user: null,
    });
  });
});
