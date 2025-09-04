import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { HabitNotFoundError } from '../errors/habit-not-found';
import { findHabitById } from '../services/find-habit-by-id';

export const getHabitByIdRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/users/:userId/habits/:habitId',
    {
      schema: {
        operationId: 'getHabitById',
        tags: ['Habit'],
        description: 'get habit by id',
        params: z.object({
          habitId: z.uuid({ version: 'v4' }),
          userId: z.uuid({ version: 'v4' }),
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
        const { habitId, userId } = request.params;

        const habit = await findHabitById({ habitId, userId });

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
