import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';
import { UpdateFailedError } from '../errors/update-failed-error';
import { UserAlreadyExistError } from '../errors/user-already-exist-error';
import { UserNotFoundError } from '../errors/user-not-found-error';
import { authenticateUserMiddleware } from '../middleware/authenticate-user-middleware';
import { updateUser } from '../services/update-user';

export const updateUserRoute: FastifyPluginAsyncZod = async app => {
  app.put(
    '/users/me',
    {
      onRequest: [authenticateUserMiddleware],
      schema: {
        operationId: 'updateUser',
        tags: ['User'],
        description: 'Update the authenticated user',
        body: z.object({
          name: z.string().min(3).max(256).optional().nullable(),
          email: z.email().optional().nullable(),
          password: z.string().min(6).optional().nullable(),
          avatarUrl: z.string().optional().nullable(),
        }),
        response: {
          200: z.object({
            id: z.uuid().optional().nullable(),
            name: z.string().optional().nullable(),
            email: z.email().optional().nullable(),
            passwordHash: z.string().optional().nullable(),
            avatarUrl: z.string().nullable(),
            createdAt: z.coerce.date().optional().nullable(),
            updatedAt: z.coerce.date().optional().nullable(),
          }),
          401: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      try {
        const { name, email, password, avatarUrl } = request.body;
        const userId = request.user.id;

        if (!userId) {
          return reply.status(401).send({ message: 'Usuário não autenticado' });
        }

        const { user } = await updateUser({
          userId,
          name,
          email,
          password,
          avatarUrl,
        });

        console.log(user);

        return reply.status(200).send(user);
      } catch (error) {
        switch (true) {
          case error instanceof UserNotFoundError:
            return reply.status(404).send({ message: error.message });

          case error instanceof UpdateFailedError:
            return reply.status(409).send({ message: error.message });

          case error instanceof UserAlreadyExistError:
            return reply.status(409).send({ message: error.message });

          default:
            console.error(error);
            return reply.status(500).send({ message: 'Internal server error' });
        }
      }
    }
  );
};
