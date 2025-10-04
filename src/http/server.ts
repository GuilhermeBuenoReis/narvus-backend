import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import { createId } from '@paralleldrive/cuid2';
import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { env } from '../config/env';
import { auth } from '../lib/auth';

import { createUserRoute } from '../routes/craete-user-route';
import { createHabitEntrieRoute } from '../routes/create-habit-entrie-route';
import { createHabitRoute } from '../routes/create-habit-route';
import { deleteHabitEntrieRoute } from '../routes/delete-habit-entrie-route';
import { deleteHabitRoute } from '../routes/delete-habit-route';
import { deleteUserRoute } from '../routes/delete-user-route';
import { getAllHabitsByUserRoute } from '../routes/get-all-habits-by-user-route';
import { getHabitEntriesRoute } from '../routes/get-entries-by-habit-id-route';
import { getHabitByIdRoute } from '../routes/get-habit-by-id-route';
import { getHabitEntriesByIdRoute } from '../routes/get-habit-entrie-by-id-route';
import { getUserByEmailRoute } from '../routes/get-user-by-email-route';
import { livenessRoute } from '../routes/liveness-route';
import { updateHabitRoute } from '../routes/update-habit-route';
import { updateUserRoute } from '../routes/update-user-route';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Swagger para a API principal
app.register(fastifySwagger, {
  openapi: {
    info: { title: 'Narvus API', version: '1.0.0' },
  },
  transform: jsonSchemaTransform,
});

// Cookies
app.register(fastifyCookie, {
  secret: env.JWT_SECRET,
  hook: 'onRequest',
  parseOptions: {},
});

// CORS
app.register(fastifyCors, {
  origin: env.CLIENT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
});

// JWT (opcional, se precisar de JWT custom nas rotas internas)
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: 'narvus_token', signed: false },
});

// Scalar / API reference
app.register(import('@scalar/fastify-api-reference'), {
  routePrefix: '/docs',
  configuration: {
    theme: 'bluePlanet',
    pageTitle: 'Narvus API',
    title: 'Narvus API',
    hideSearch: true,
    hideModels: true,
    favicon: '../../assets/logo-narvus',
  },
});

// Better Auth handler para todas as rotas de auth
app.route({
  method: ['GET', 'POST'],
  url: '/api/auth/*',
  async handler(request, reply) {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const headers = new Headers();
    Object.entries(request.headers).forEach(([key, value]) => {
      if (value) headers.append(key, value.toString());
    });
    const req = new Request(url.toString(), {
      method: request.method,
      headers,
      body: request.body ? JSON.stringify(request.body) : undefined,
    });
    const response = await auth.handler(req);

    reply.status(response.status);
    response.headers.forEach((value, key) => reply.header(key, value));
    reply.send(response.body ? await response.text() : null);
  },
});

// Rotas de saúde
app.register(livenessRoute);

// Rotas de usuário e hábitos
app.register(createUserRoute);
app.register(createHabitRoute);
app.register(createHabitEntrieRoute);

app.register(getHabitByIdRoute);
app.register(getUserByEmailRoute);
app.register(getHabitEntriesRoute);
app.register(getAllHabitsByUserRoute);
app.register(getHabitEntriesByIdRoute);

app.register(updateUserRoute);
app.register(updateHabitRoute);

app.register(deleteUserRoute);
app.register(deleteHabitRoute);
app.register(deleteHabitEntrieRoute);

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => {
  console.log('Http server running 🚀🚀');
});

if (env.NODE_ENV === 'development') {
  const specFile = resolve(__dirname, '../../swagger.json');
  app.ready().then(async () => {
    const spec = JSON.stringify(app.swagger(), null, 2);
    await writeFile(specFile, spec);
    console.log('Swagger spec generated!');
    console.log(createId());
  });
}
