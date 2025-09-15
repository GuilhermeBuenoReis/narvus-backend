import z from 'zod';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { findUserByEmail } from './find-user-by-email';

export const getUserByEmailSchema = z.object({
  email: z.email(),
});

export type GetUserByEmailInput = z.infer<typeof getUserByEmailSchema>;
export async function getUserByEmail({ email }: GetUserByEmailInput) {
  const { user } = await findUserByEmail({ email });

  if (!user) {
    throw new UserNotFoundError(email);
  }

  return { user };
}
