import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import z from 'zod';
import { UserNotFoundError } from '../errors/user-not-found';
import { getUserByEmail } from '../services/get-user-by-email';

export const getUserByEmailRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/user/get-user',
    {
      schema: {
        operationId: 'getUser',
        tags: ['User'],
        description: 'get user',
        body: z.object({
          email: z.string().min(8).max(256),
        }),
        reponse: z.object({
          name: z.string().min(8).max(256),
          email: z.string().email().max(256),
          avatarUrl: z.string().max(2048).optional(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { email } = request.body;
        const user = await getUserByEmail({ email });

        return reply.status(200).send(user);
      } catch (error) {
        if (error instanceof UserNotFoundError) {
          return reply.status(404).send({ message: error.message });
        }
        request.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
