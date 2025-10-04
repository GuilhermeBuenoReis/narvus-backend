import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('production'),

  DATABASE_URL: z.url(),

  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),

  CLIENT_ORIGIN: z.string().optional().default('http://localhost:3000'),
});

export const env = envSchema.parse(process.env);
