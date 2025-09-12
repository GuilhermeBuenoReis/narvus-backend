import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { logout } from '../services/logout';

export const logoutRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/user/logout',
    {
      schema: {
        operationId: 'logoutUser',
        tags: ['Authentication', 'User'],
        description: 'Logs out the user and revokes the refresh token',
        body: z.object({ refreshToken: z.string() }),
        response: {
          200: z.object({ success: z.boolean() }),
        },
      },
    },
    async (request, reply) => {
      const { refreshToken: rToken } = request.body;

      const result = await logout({ refreshToken: rToken });

      reply
        .clearCookie('narvus_token', { path: '/' })
        .clearCookie('narvus_refresh', { path: '/' })
        .status(200)
        .send(result);
    }
  );
};
