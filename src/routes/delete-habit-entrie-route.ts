import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { HabitEntrieNotFoundError } from '../errors/habit-entrie-not-found-error';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { deleteHabitEntrie } from '../services/delete-habit-entrie';

export const deleteHabitEntrieRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/habits/entrie/:habitEntrieId',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'deleteHabitEntrie',
        tags: ['Habit', 'Habit Entrie'],
        description: 'delete habit entrie',
        params: z.object({
          habitEntrieId: z.uuid({ version: 'v4' }),
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
        const { habitEntrieId } = request.params;

        await deleteHabitEntrie({ habitEntrieId });

        return reply.status(200).send({ sucess: true });
      } catch (error) {
        request.log.error(error);
        if (error instanceof HabitEntrieNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
