import 'dotenv/config';

import { defineConfig } from 'drizzle-kit';
import { env } from './src/config/env';

export default defineConfig({
  out: './.migrations',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
