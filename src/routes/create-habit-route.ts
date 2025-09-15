import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { InvalidUserIdError } from '../errors/invalid-user-id-error';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { createHabit } from '../services/create-habit';

export const createHabitRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/habit/create-habit',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'createHabit',
        tags: ['Habit'],
        description: 'Create a new habit',
        body: z.object({
          title: z.string().min(3).max(256),
          description: z.string().max(2048).optional(),
          frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
          startsDate: z.coerce.date().optional(),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
          409: z.object({
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
        const userId = request.user?.id;
        if (!userId) throw new InvalidUserIdError(userId);

        const { title, description, frequency, startsDate } = request.body;

        await createHabit({
          userId,
          title,
          description,
          frequency,
          startsDate,
        });

        return reply
          .status(201)
          .send({ message: 'Hábito criado com sucesso!' });
      } catch (error) {
        if (error instanceof InvalidUserIdError) {
          return reply.status(409).send({ message: error.message });
        }

        request.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
