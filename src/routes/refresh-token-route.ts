import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { UnauthorizedError } from '../errors/unauthorized-error';
import { refreshToken } from '../services/refresh-token';

export const refreshTokenRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/user/refresh',
    {
      schema: {
        operationId: 'refreshToken',
        tags: ['Authentication', 'User'],
        description: 'Renews accessToken using valid refreshToken',
        body: z.object({
          refreshToken: z.string(),
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
        const { refreshToken: rToken } = request.body;

        const result = await refreshToken({ refreshToken: rToken });

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
