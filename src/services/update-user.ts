import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';
import { UpdateFailedError } from '../errors/update-failed-error';
import { UserAlreadyExistError } from '../errors/user-already-exist-error';
import { findUserByEmail } from './find-user-by-email';
import { getUserById } from './get-user-by-id';

interface UpdateUserRequest {
  userId: string;
  name?: string | null;
  email?: string | null;
  password?: string | null;
  avatarUrl?: string | null;
}

export async function updateUser({
  userId,
  avatarUrl,
  email,
  name,
  password,
}: UpdateUserRequest) {
  await getUserById({ userId });

  if (email) {
    const { user: foundUser } = await findUserByEmail({ email });
    if (foundUser && foundUser.id !== userId) {
      throw new UserAlreadyExistError(email);
    }
  }

  const dataToUpdate: {
    name?: string;
    email?: string;
    passwordHash?: string;
    avatarUrl?: string | null;
  } = {};

  if (name) dataToUpdate.name = name;
  if (email) dataToUpdate.email = email;
  if (avatarUrl !== undefined) dataToUpdate.avatarUrl = avatarUrl;

  if (password) {
    const passwordHash = await bcrypt.hash(password, 10);
    dataToUpdate.passwordHash = passwordHash;
  }

  if (Object.keys(dataToUpdate).length === 0) {
    throw new UpdateFailedError(
      'Nenhum dado fornecido para atualização.',
      userId
    );
  }

  const [updatedUser] = await db
    .update(users)
    .set(dataToUpdate)
    .where(eq(users.id, userId))
    .returning();

  if (!updatedUser) {
    throw new UpdateFailedError('User', userId);
  }

  return {
    user: updatedUser,
  };
}
