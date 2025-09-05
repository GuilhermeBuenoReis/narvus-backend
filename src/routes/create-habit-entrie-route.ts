import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { HabitNotFoundError } from '../errors/habit-not-found';
import { UserNotFoundError } from '../errors/user-not-found';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { createHabitEntrie } from '../services/create-habit-entrie';

export const createHabitEntrieRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/habit-entry/create',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'createHabitEntrie',
        tags: ['Habit Entry'],
        description: 'Create a new entry for a specific habit',
        body: z.object({
          habitId: z.uuid({ version: 'v4' }),
          entryDate: z.coerce.date().optional(),
          completed: z.boolean().default(false),
        }),
        response: {
          201: z.object({
            message: z.string(),
          }),
          401: z.object({
            message: z.string(),
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
        if (!userId) {
          return reply.status(401).send({ message: 'User not authenticated.' });
        }

        const { habitId, entryDate, completed } = request.body;

        await createHabitEntrie({
          userId,
          habitId,
          entryDate,
          completed,
        });

        if (completed === false)
          return reply
            .status(201)
            .send({ message: 'Hábito não concluído com sucesso!' });

        return reply
          .status(201)
          .send({ message: 'Hábito concluído com sucesso' });
      } catch (error) {
        if (
          error instanceof UserNotFoundError ||
          error instanceof HabitNotFoundError
        ) {
          return reply.status(404).send({ message: error.message });
        }

        request.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
