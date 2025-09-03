import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { InvalidUserIdError } from '../errors/invalid-user-id';
import { createHabit } from '../services/create-habit';

export const createhabitRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create-habit',
    {
      schema: {
        operationId: 'createhabit',
        tags: ['Habit'],
        description: 'Create a new habit',
        body: z.object({
          userId: z.uuid({ version: 'v4' }),
          title: z.string().min(3).max(256),
          description: z.string().max(2048).optional(),
          frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
          startsDate: z.coerce.date().optional(),
        }),
        reponse: {
          201: z.object({
            message: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId, title, description, frequency, startsDate } =
          request.body;

        await createHabit({
          userId,
          title,
          description,
          frequency,
          startsDate,
        });

        reply.status(201).send({ message: 'Hábito criado com sucesso!' });
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
