import { describe, expect, it } from 'vitest';
import { UserNotFoundError } from '../errors/user-not-found';
import { makeUser } from '../test/mocks/user';
import { getUserByEmail } from './get-user-by-email';

describe('getUserByEmail service', () => {
  it('should return the user when found', async () => {
    const { id, name, email, passwordHash, avatarUrl, createdAt, updatedAt } =
      await makeUser();

    const result = await getUserByEmail({ email });

    expect(result).toEqual({
      user: {
        id,
        name,
        email,
        avatarUrl,
        passwordHash,
        createdAt,
        updatedAt,
      },
    });
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    const email = 'nonexistent@example.com';

    await expect(getUserByEmail({ email })).rejects.toBeInstanceOf(
      UserNotFoundError
    );
  });
});
