import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import fastifyCookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import { createId } from '@paralleldrive/cuid2';
import fastify from 'fastify';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { authenticateUserRoute } from '../routes/authenticate-user-route';
import { createUserRoute } from '../routes/craete-user-route';
import { createhabitRoute } from '../routes/create-habit-route';
import { getUserByEmailRoute } from '../routes/get-user-by-email-route';
import { env } from './env';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Narvus API',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifyCookie, {
  secret: env.JWT_SECRET,
  hook: 'onRequest',
  parseOptions: {},
});

app.register(import('@scalar/fastify-api-reference'), {
  routePrefix: '/docs',
  configuration: {
    theme: 'bluePlanet',
    pageTitle: 'Narvus API',
    title: 'Narvus API',
    hideSearch: true,
    hideModels: true,
  },
});

app.register(createUserRoute);
app.register(createhabitRoute);
app.register(getUserByEmailRoute);
app.register(authenticateUserRoute);

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('Http server running 🚀🚀');
  });

if (env.NODE_ENV === 'development') {
  const specFile = resolve(__dirname, '../../swagger.json');

  app.ready().then(() => {
    const spec = JSON.stringify(app.swagger(), null, 2);

    writeFile(specFile, spec).then(() => {
      console.log('Swagger spec generated!');
      console.log(createId());
    });
  });
}
