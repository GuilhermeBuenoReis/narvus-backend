import { describe, expect, it } from 'vitest';
import { makeUser } from '../test/factories/user';
import { authenticateUser } from './authenticate-user';
import { logout } from './logout';
import { refreshToken } from './refresh-token';

describe('logout flow', () => {
  it('should revoke refresh token and prevent further refresh', async () => {
    const { email, password } = await makeUser();
    const { refreshToken: token } = await authenticateUser({ email, password });

    const result = await logout({ refreshToken: token });
    expect(result).toEqual({ success: true });

    await expect(refreshToken({ refreshToken: token })).rejects.toThrow(
      'Refresh token inválido ou expirado.'
    );
  });
});
