import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { HabitNotFoundError } from '../errors/habit-not-found';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { getEntreisByHabitId } from '../services/get-entries-by-habit-id';

export const getHabitEntriesRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/habits/:habitId/entries',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'getHabitEntries',
        tags: ['Habit', 'Habit Entry'],
        description: 'Get all entries for a specific habit.',
        params: z.object({
          habitId: z.uuid({ version: 'v4' }),
        }),
        response: {
          200: z.object({
            entries: z.array(
              z.object({
                id: z.uuid({ version: 'v4' }),
                userId: z.uuid({ version: 'v4' }),
                habitId: z.uuid({ version: 'v4' }),
                entryDate: z.coerce.date(),
                completed: z.boolean(),
                createdAt: z.coerce.date(),
              })
            ),
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
        const { habitId } = request.params;
        const userId = request.user.id;

        const { entries } = await getEntreisByHabitId({ habitId, userId });

        return reply.status(200).send({ entries });
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
