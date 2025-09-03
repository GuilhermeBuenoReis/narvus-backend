import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { createHabit } from '../services/create-habit';

export const createhabitRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/create-habit',
    {
      schema: {
        operationId: 'createhabit',
        tags: ['habit'],
        description: 'Create a new habit',
        params: z.object({
          userId: z.uuid(),
        }),
        body: z.object({
          title: z.string().min(3).max(256),
          description: z.string().max(2048).optional(),
          frequency: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
          startsDate: z.date().optional(),
        }),
        reponse: {
          201: z.null(),
        },
      },
    },
    async (request, reply) => {
      try {
        const { userId } = request.params;
        const { title, description, frequency, startsDate } = request.body;

        await createHabit({
          userId,
          title,
          description,
          frequency,
          startsDate,
        });

        reply.status(201).send();
      } catch (error) {
        if (error instanceof habitAlreadyExistError) {
          return reply.status(409).send({ message: error.message });
        }
        request.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
