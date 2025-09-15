import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { HabitNotFoundError } from '../errors/habit-not-found-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { updateHabit } from '../services/update-habit';

export const updateHabitRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/habits/:habitId',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'updateHabit',
        tags: ['Habit'],
        description: 'Update an existing habit',
        params: z.object({
          habitId: z.uuid({ version: 'v4' }),
        }),
        body: z.object({
          title: z.string().min(3).max(256).optional(),
          description: z.string().max(2048).optional(),
          frequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
          startsDate: z.coerce.date().optional(),
        }),
        response: {
          200: z.object({
            habit: z.object({
              id: z.uuid({ version: 'v4' }),
              userId: z.uuid({ version: 'v4' }),
              title: z.string(),
              description: z.string().nullable(),
              frequency: z.enum(['daily', 'weekly', 'monthly']),
              startsDate: z.coerce.date().optional(),
            }),
          }),
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { habitId } = request.params;
        const { title, description, frequency, startsDate } = request.body;

        const userId = request.user.id;
        if (!userId) throw new UserNotFoundError('Usuário não autenticado');

        const response = await updateHabit({
          habitId,
          userId,
          title,
          description,
          frequency,
          startsDate,
        });

        return reply.status(200).send(response);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(401).send({ message: error.message });
        }

        if (error instanceof HabitNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }

        request.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
