import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { deleteUser } from '../services/delete-user';

export const deleteUserRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/user/me/:userId',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'deleteUser',
        tags: ['User'],
        description: 'delete User',
        params: z.object({
          userId: z.uuid({ version: 'v4' }),
        }),
        response: {
          200: z.object({
            sucess: z.boolean(),
          }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId } = request.params;

        await deleteUser({ userId });

        return reply.status(200).send({ sucess: true });
      } catch (error) {
        request.log.error(error);
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
