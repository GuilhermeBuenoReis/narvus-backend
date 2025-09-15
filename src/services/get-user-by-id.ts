import { InvalidUserIdError } from '../errors/invalid-user-id-error';
import { findUserById } from './find-user-by-id';

interface GetUserByIdSchema {
  userId: string;
}

export async function getUserById({ userId }: GetUserByIdSchema) {
  const { user } = await findUserById({ userId });

  if (!user) {
    throw new InvalidUserIdError(userId);
  }

  return {
    user,
  };
}
