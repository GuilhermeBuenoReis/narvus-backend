import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { authenticateUser } from '../services/authenticate-user';

export const authenticateUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/user/authenticate',
    {
      schema: {
        operationId: 'authenticateUser',
        tags: ['Authentication', 'User'],
        description:
          'Realiza login e retorna accessToken (15m) + refreshToken (7d)',
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            accessToken: z.string(),
            refreshToken: z.string(),
          }),
          401: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;
        const result = await authenticateUser({ email, password });

        reply
          .setCookie('narvus_token', result.accessToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 15,
          })
          .setCookie('narvus_refresh', result.refreshToken, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
          })
          .status(200)
          .send(result);
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          return reply.status(401).send({ message: err.message });
        }
        throw err;
      }
    }
  );
};
