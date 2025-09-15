import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { UserAlreadyExistError } from '../errors/user-already-exist-error';
import { createUser } from '../services/create-user';

export const createUserRoute: FastifyPluginAsyncZod = async app => {
  app.post(
    '/user/me/create',
    {
      schema: {
        operationId: 'createUser',
        tags: ['User'],
        description: 'Create a new user',
        body: z.object({
          name: z.string().min(8).max(256),
          email: z.email().max(256),
          password: z.string().min(8).max(128),
          avatarUrl: z.string().max(2048).optional(),
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
        const { name, email, password, avatarUrl } = request.body;

        await createUser({
          name,
          email,
          password,
          avatarUrl,
        });

        reply.status(201).send({ message: 'Usuário criado com sucesso!' });
      } catch (error) {
        if (error instanceof UserAlreadyExistError) {
          return reply.status(409).send({ message: error.message });
        }

        request.log.error(error);
        return reply.status(500).send({ message: 'Internal server error' });
      }
    }
  );
};
