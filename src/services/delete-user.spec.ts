import { describe, expect, it } from 'vitest';
import { makeUser } from '../test/factories/user';
import { deleteUser } from './delete-user';

describe('delete user', () => {
  it('should be able to delete a user', async () => {
    const user = await makeUser();

    const result = await deleteUser({ userId: user.id });

    expect(result).toEqual({ success: true });

    await expect.objectContaining({
      success: true,
    });
  });
});
