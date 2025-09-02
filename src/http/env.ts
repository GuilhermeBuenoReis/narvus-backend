import z from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .optional()
    .default('production'),

  DATABASE_URL: z.url(),

  JWT_SECRET: z.string(),
});

export const env = envSchema.parse(process.env);
