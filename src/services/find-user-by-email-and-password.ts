import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../db/schema';
import { InvalidCredentialsError } from '../errors/invalid-credentials';
import { UserNotFoundError } from '../errors/user-not-found';

export const findUserByEmailAndPasswordSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type FindUserByEmailAndPasswordInput = z.infer<
  typeof findUserByEmailAndPasswordSchema
>;

export async function findUserByEmailAndPassword({
  email,
  password,
}: FindUserByEmailAndPasswordInput) {
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      passwordHash: users.passwordHash,
      avatarUrl: users.avatarUrl,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    throw new UserNotFoundError(email);
  }

  const passwordMatches = user.passwordHash
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!passwordMatches) {
    throw new InvalidCredentialsError();
  }

  return { user };
}
