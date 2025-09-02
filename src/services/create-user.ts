import bcrypt from 'bcrypt';
import { db } from '../db';
import { users } from '../db/schema';
import { UserAlreadyExistError } from '../errors/user-already-exist';
import { findUserByEmail } from './find-user-by-email';

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
}

export async function createUser({
  name,
  email,
  password,
  avatarUrl,
}: CreateUserRequest) {
  const { user: existingUser } = await findUserByEmail({ email });

  if (existingUser) {
    throw new UserAlreadyExistError(email);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const [response] = await db
    .insert(users)
    .values({
      name,
      email,
      passwordHash,
      avatarUrl,
    })
    .returning();

  const user = response;

  return { user };
}
