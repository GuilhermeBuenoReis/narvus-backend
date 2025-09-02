import { UserNotFoundError } from '../errors/user-not-found';
import { findUserByEmail } from './find-user-by-email';

interface GetUserByEmailRequest {
  email: string;
}

export async function getUserByEmail({ email }: GetUserByEmailRequest) {
  const { user } = await findUserByEmail({ email });

  if (!user) {
    throw new UserNotFoundError(email);
  }

  return { user };
}
