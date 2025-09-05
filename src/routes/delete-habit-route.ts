import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { HabitNotFoundError } from '../errors/habit-not-found';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { deleteHabit } from '../services/delete-habit';

export const deleteHabitRoute: FastifyPluginAsyncZod = async app => {
  app.delete(
    '/habits/:habitId',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'deleteHabit',
        tags: ['Habit'],
        description: 'delete habit',
        params: z.object({
          habitId: z.uuid({ version: 'v4' }),
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
        const { habitId } = request.params;

        await deleteHabit({ habitId });

        return reply.status(200).send({ sucess: true });
      } catch (error) {
        request.log.error(error);
        if (error instanceof HabitNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
