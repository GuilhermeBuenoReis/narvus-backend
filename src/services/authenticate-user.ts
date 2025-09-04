import jwt from 'jsonwebtoken';
import { env } from '../middleware/env';
import { findUserByEmailAndPassword } from './find-user-by-email-and-password';

interface AuthenticateUserRequest {
  email: string;
  password: string;
}

export async function authenticateUser({
  email,
  password,
}: AuthenticateUserRequest) {
  const { user } = await findUserByEmailAndPassword({ email, password });

  const token = jwt.sign(
    {
      userId: user.id,
    },
    env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return {
    token,
  };
}
