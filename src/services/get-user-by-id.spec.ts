import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { InvalidUserIdError } from '../errors/invalid-user-id-error';
import { makeUser } from '../test/factories/user';
import { getUserById } from './get-user-by-id';

describe('getUserById service', () => {
  it('should return the user when found', async () => {
    const { id, name, email, passwordHash, avatarUrl, createdAt, updatedAt } =
      await makeUser();

    const result = await getUserById({ userId: id });

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

  it('should throw InvalidUserIdError when user does not exist', async () => {
    const userId = faker.string.uuid();

    await expect(getUserById({ userId })).rejects.toBeInstanceOf(
      InvalidUserIdError
    );
  });
});
