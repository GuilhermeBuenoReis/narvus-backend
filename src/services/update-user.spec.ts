import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import { describe, expect, it, vi } from 'vitest';
import * as dbModule from '../db';
import { InvalidUserIdError } from '../errors/invalid-user-id-error';
import { UpdateFailedError } from '../errors/update-failed-error';
import { UserAlreadyExistError } from '../errors/user-already-exist-error';
import { makeUser } from '../test/factories/user';
import { updateUser } from './update-user';

describe('update user service', () => {
  it('should be able to update a user with all fields', async () => {
    const user = await makeUser();

    const newName = faker.person.fullName();
    const newEmail = faker.internet.email();
    const newAvatarUrl = faker.image.avatar();
    const newPassword = faker.internet.password();

    const result = await updateUser({
      userId: user.id,
      name: newName,
      email: newEmail,
      avatarUrl: newAvatarUrl,
      password: newPassword,
    });

    expect(result.user).toMatchObject({
      id: user.id,
      name: newName,
      email: newEmail,
      avatarUrl: newAvatarUrl,
    });

    const isPasswordValid = await bcrypt.compare(
      newPassword,
      result.user.passwordHash
    );
    expect(isPasswordValid).toBe(true);
  });

  it('should update only the name if only name is provided', async () => {
    const user = await makeUser();
    const newName = faker.person.fullName();

    const result = await updateUser({
      userId: user.id,
      name: newName,
    });

    expect(result.user.name).toBe(newName);
    expect(result.user.email).toBe(user.email);
  });

  it('should throw UserAlreadyExistError if email is taken by another user', async () => {
    const userToUpdate = await makeUser();
    const anotherUser = await makeUser();

    await expect(
      updateUser({
        userId: userToUpdate.id,
        email: anotherUser.email,
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistError);
  });

  it('should throw InvalidUserIdError if userId is invalid', async () => {
    const fakeUserId = faker.string.uuid();

    await expect(
      updateUser({
        userId: fakeUserId,
        name: faker.person.fullName(),
      })
    ).rejects.toBeInstanceOf(InvalidUserIdError);
  });

  it('should throw UpdateFailedError if update affects no rows', async () => {
    const user = await makeUser();

    const updateSpy = vi.spyOn(dbModule.db, 'update').mockReturnValue({
      set: () => ({
        where: () => ({
          returning: async () => [],
        }),
      }),
    } as any);

    await expect(
      updateUser({
        userId: user.id,
        name: 'Novo Nome',
      })
    ).rejects.toBeInstanceOf(UpdateFailedError);

    updateSpy.mockRestore();
  });
});
