import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { db } from '../db';
import { revokedTokens } from '../db/schema';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { env } from '../http/env';
import { findUserById } from './find-user-by-id';

interface RefreshTokenInput {
  refreshToken: string;
}

export async function refreshToken({ refreshToken }: RefreshTokenInput) {
  try {
    const [revoked] = await db
      .select()
      .from(revokedTokens)
      .where(eq(revokedTokens.token, refreshToken));

    if (revoked) throw new UnauthorizedError('Refresh token revogado.');

    const payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      sub: string;
    };

    const { user } = await findUserById({ userId: payload.sub });
    if (!user) throw new UnauthorizedError('Usuário não encontrado.');

    const newAccessToken = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      env.JWT_SECRET,
      { subject: user.id, expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign({}, env.JWT_REFRESH_SECRET, {
      subject: user.id,
      expiresIn: '7d',
    });

    await db.insert(revokedTokens).values({ token: refreshToken });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    console.error(err);
    throw new UnauthorizedError('Refresh token inválido ou expirado.');
  }
}
