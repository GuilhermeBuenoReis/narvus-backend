import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { HabitEntrieNotFoundError } from '../errors/habit-entrie-not-found-error';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { getHabitEntriesById } from '../services/get-habit-entrie-by-id';

export const getHabitEntriesByIdRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/habits/entries/:habitEntrieId',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'getHabitEntriesById',
        tags: ['Habit', 'Habit Entrie'],
        description: 'Get habit entrie for a specific id.',
        params: z.object({
          habitId: z.uuid({ version: 'v4' }),
          habitEntrieId: z.uuid({ version: 'v4' }),
        }),
        response: {
          200: z.object({
            id: z.uuid({ version: 'v4' }),
            userId: z.uuid({ version: 'v4' }),
            habitId: z.uuid({ version: 'v4' }),
            entryDate: z.coerce.date(),
            completed: z.boolean(),
            createdAt: z.coerce.date(),
          }),
          404: z.object({
            message: z.string(),
          }),
          500: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { habitEntrieId } = request.params;

        const { entrie } = await getHabitEntriesById({
          habitEntrieId,
        });

        return reply.status(200).send(entrie);
      } catch (error) {
        if (error instanceof HabitEntrieNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        request.log.error(error);

        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
