import bcrypt from 'bcrypt';
import { z } from 'zod';
import { db } from '../db';
import { users } from '../db/schema';
import { UserAlreadyExistError } from '../errors/user-already-exist';
import { findUserByEmail } from './find-user-by-email';

export const createUserInputSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  avatarUrl: z.url().optional(),
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

export async function createUser({
  name,
  email,
  password,
  avatarUrl,
}: CreateUserInput) {
  const { user: existingUser } = await findUserByEmail({ email });

  if (existingUser) {
    throw new UserAlreadyExistError(email);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [user] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
      avatarUrl,
    })
    .returning();

  return { user };
}
