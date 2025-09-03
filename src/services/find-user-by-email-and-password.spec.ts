import { describe, expect, it } from 'vitest';
import { makeUser } from '../test/factories/user';
import { findUserByEmailAndPassword } from './find-user-by-email-and-password';

describe('find user by email and password', () => {
  it('should be able to find user by email and password', async () => {
    const { id, name, email, password, passwordHash, avatarUrl } =
      await makeUser();

    const result = await findUserByEmailAndPassword({
      email: email,
      password,
    });

    expect(result).toEqual({
      user: {
        id,
        name,
        email: email,
        passwordHash,
        avatarUrl,
      },
    });
  });
});
