import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { schema } from '../db/schema';
import { InvalidCredentialsError } from '../errors/invalid-credentials-error';
import { UserNotFoundError } from '../errors/user-not-found-error';

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
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
      passwordHash: schema.users.passwordHash,
      avatarUrl: schema.users.avatarUrl,
    })
    .from(schema.users)
    .where(eq(schema.users.email, email))
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
