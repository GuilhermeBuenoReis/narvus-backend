import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { HabitNotFoundError } from '../errors/habit-not-found-error';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { findHabitById } from '../services/find-habit-by-id';

export const getHabitByIdRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/habits/:id',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'getHabitById',
        tags: ['Habit'],
        description: 'get habit by id',
        params: z.object({
          id: z.uuid({ version: 'v4' }),
        }),
        reponse: z.object({
          id: z.uuid({ version: 'v4' }),
          title: z.string().min(3).max(256),
          description: z.string().max(2048).optional(),
          frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
          startsDate: z.coerce.date().optional(),
          userId: z.uuid({ version: 'v4' }),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const userId = request.user.id;

        const habit = await findHabitById({ habitId: id, userId });

        return reply.status(200).send(habit);
      } catch (error) {
        if (error instanceof HabitNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        request.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
