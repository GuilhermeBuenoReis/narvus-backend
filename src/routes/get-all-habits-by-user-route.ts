import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod/v4';
import { ListHabitsByUserNotFoundError } from '../errors/list-habits--by-user-not-found-error';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { getAllHabitsByUser } from '../services/get-all-habits-by-user';

export const getAllHabitsByUserRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/user/habits/get-all',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'getAllHabitsByUser',
        tags: ['Habit'],
        description: 'Get all habits for a given user',
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
        const userId = request.user.id;

        const result = await getAllHabitsByUser({ userId });

        return reply.status(200).send(result);
      } catch (error) {
        if (error instanceof ListHabitsByUserNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        request.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
