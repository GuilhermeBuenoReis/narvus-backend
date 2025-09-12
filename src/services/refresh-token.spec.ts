import { describe, expect, it } from 'vitest';
import { makeUser } from '../test/factories/user';
import { authenticateUser } from './authenticate-user';
import { refreshToken } from './refresh-token';

describe('refresh token', () => {
  it('should be able to refresh an access token', async () => {
    const { email, password } = await makeUser();

    const { refreshToken: oldRefreshToken } = await authenticateUser({
      email,
      password,
    });

    const result = await refreshToken({ refreshToken: oldRefreshToken });

    expect(result).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should not refresh if refresh token is invalid', async () => {
    await expect(
      refreshToken({ refreshToken: 'invalid.token.here' })
    ).rejects.toThrow('Refresh token inválido ou expirado.');
  });
});
