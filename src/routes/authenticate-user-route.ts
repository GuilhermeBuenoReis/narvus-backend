import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { authenticateUser } from '../services/authenticate-user';

export const authenticateUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/login',
    {
      schema: {
        operationId: 'authenticateUser',
        tags: ['Authentication', 'User'],
        description:
          'Realiza o login do usuário e retorna o token JWT com validade de 60 dias',
        body: z.object({
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          401: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;

        const result = await authenticateUser({ email, password });

        reply
          .setCookie('narvus_token', result.token, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 60,
          })
          .status(200)
          .send({ token: result.token, success: true });
      } catch (err) {
        if (err instanceof UnauthorizedError) {
          return reply.status(401).send({ message: err.message });
        }
        throw err;
      }
    }
  );
};
