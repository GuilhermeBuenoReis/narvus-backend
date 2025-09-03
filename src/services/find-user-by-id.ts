import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

interface findUserByIdRequest {
  userId: string;
}

export async function findUserById({ userId }: findUserByIdRequest) {
  const [response] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const user = response ?? null;

  return {
    user,
  };
}
