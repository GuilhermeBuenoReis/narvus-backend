import { db } from '../db';
import { revokedTokens } from '../db/schema';

interface LogoutInput {
  refreshToken: string;
}

export async function logout({ refreshToken }: LogoutInput) {
  await db.insert(revokedTokens).values({ token: refreshToken });

  return { success: true };
}
