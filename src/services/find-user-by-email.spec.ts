import { describe, expect, it } from 'vitest';
import { makeUser } from '../test/mocks/user';
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

  it('should return null if user not found', async () => {
    const result = await findUserByEmail({ email: 'invalid-email' });

    expect(result).toEqual({
      user: null,
    });
  });
});
