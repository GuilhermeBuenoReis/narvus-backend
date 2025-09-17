import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

export const livenessRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/health/liveness',
    {
      schema: {
        operationId: 'livenessCheck',
        tags: ['Health'],
        description: 'Verifica se a aplicação está viva',
        response: {
          200: z.object({ status: z.literal('alive') }),
        },
      },
    },
    async (_request, reply) => {
      reply.status(200).send({ status: 'alive' });
    }
  );
};
