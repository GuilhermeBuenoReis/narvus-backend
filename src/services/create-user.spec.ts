import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';
import { UserAlreadyExistError } from '../errors/user-already-exist-error';
import { createUser } from './create-user';

describe('create user service', () => {
  it('should be able to create user', async () => {
    const result = await createUser({
      email: faker.internet.email(),
      name: faker.person.fullName(),
      password: faker.internet.password(),
      avatarUrl: faker.image.avatarGitHub(),
    });

    const { id, name, email, passwordHash, avatarUrl, createdAt, updatedAt } =
      result.user;

    expect(result).toEqual({
      user: {
        id,
        name,
        email,
        passwordHash,
        avatarUrl,
        createdAt,
        updatedAt,
      },
    });
  });

  it('should not be able to create user with same email twice', async () => {
    const email = faker.internet.email();

    await createUser({
      email,
      name: faker.person.fullName(),
      password: faker.internet.password(),
      avatarUrl: faker.image.avatarGitHub(),
    });

    await expect(() =>
      createUser({
        email,
        name: faker.person.fullName(),
        password: faker.internet.password(),
        avatarUrl: faker.image.avatarGitHub(),
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
