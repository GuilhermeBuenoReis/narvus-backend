import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

interface findUserByEmailRequest {
  email: string;
}

export async function findUserByEmail({ email }: findUserByEmailRequest) {
  const [response] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user = response ?? null;

  return {
    user,
  };
}
