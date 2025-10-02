import { db } from '../db';
import { schema } from '../db/schema';

interface LogoutInput {
  refreshToken: string;
}

export async function logout({ refreshToken }: LogoutInput) {
  await db.insert(schema.revokedTokens).values({ token: refreshToken });

  return { success: true };
}
