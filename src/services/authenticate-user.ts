import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { findUserByEmail } from './find-user-by-email';

interface AuthenticateUserInput {
  email: string;
  password: string;
}

export async function authenticateUser({
  email,
  password,
}: AuthenticateUserInput) {
  const { user } = await findUserByEmail({ email });

  if (!user) {
    throw new UnauthorizedError('Credenciais inválidas.');
  }

  const doesPasswordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!doesPasswordMatch) {
    throw new UnauthorizedError('Credenciais inválidas.');
  }

  const accessToken = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    env.JWT_SECRET,
    {
      subject: user.id,
      expiresIn: '15m',
    }
  );

  const refreshToken = jwt.sign({}, env.JWT_REFRESH_SECRET, {
    subject: user.id,
    expiresIn: '7d',
  });

  return {
    accessToken,
    refreshToken,
  };
}
