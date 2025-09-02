import type { FastifyRequest } from 'fastify';
import { UnauthorizedError } from '../errors/unauthorized-error';

export async function authenticateUserMiddleware(request: FastifyRequest) {
  try {
    await request.jwtVerify();
  } catch (error) {
    console.log(error);
    throw new UnauthorizedError();
  }
}
