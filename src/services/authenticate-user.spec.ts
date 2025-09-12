import { describe, expect, it } from 'vitest';
import { makeUser } from '../test/factories/user';
import { authenticateUser } from './authenticate-user';

describe('authenticate user', () => {
  it('shoud be able to authenticate user', async () => {
    const { email, password } = await makeUser();

    const result = await authenticateUser({ email, password });

    expect(result).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });
});
