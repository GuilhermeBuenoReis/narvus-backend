import { describe, expect, it } from 'vitest';
import { makeUser } from '../test/mocks/user';
import { authenticateUser } from './authenticate-user';

describe('authenticate user', () => {
  it('shoud be able to authenticate user', async () => {
    const { email, password } = await makeUser();

    const result = await authenticateUser({ email, password });

    expect(result).toEqual({
      token: expect.any(String),
    });
  });
});
