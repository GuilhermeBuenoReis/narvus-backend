import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { HabitsNotFoundError } from '../errors/list-habits--by-user-not-found';
import { getAllHabitsByUser } from '../services/get-all-habits-by-user';

export const getAllHabitsByUserRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/users/:userId/habits',
    {
      schema: {
        operationId: 'getAllHabitsByUser',
        tags: ['Habit'],
        description: 'Get all habits for a given user',
        params: z.object({
          userId: z.uuid({ version: 'v4' }),
        }),
        response: {
          200: z.object({
            habits: z.array(
              z.object({
                id: z.uuid({ version: 'v4' }),
                userId: z.uuid({ version: 'v4' }),
                title: z.string(),
                description: z.string().nullable(),
                frequency: z.enum(['daily', 'weekly', 'monthly']),
                startsDate: z.string(),
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
        const { userId } = request.params;

        const result = await getAllHabitsByUser({ userId });

        return reply.status(200).send(result);
      } catch (error) {
        if (error instanceof HabitsNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        request.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
