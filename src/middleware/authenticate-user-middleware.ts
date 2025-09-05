import type { FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { env } from '../http/env';

export async function authenticateUserMiddleware(request: FastifyRequest) {
  const token = request.cookies.narvus_token;

  if (!token) {
    throw new UnauthorizedError('Token não fornecido.');
  }

  try {
    const decodedPayload = jwt.verify(token, env.JWT_SECRET) as {
      id: string;
      name: string;
      email: string;
    };

    request.user = {
      id: decodedPayload.id,
      name: decodedPayload.name,
      email: decodedPayload.email,
    };
  } catch (err) {
    console.error(err);
    throw new UnauthorizedError('Token inválido ou expirado.');
  }
}
