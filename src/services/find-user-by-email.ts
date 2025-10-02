import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '../db';
import { schema } from '../db/schema';

export const findUserByEmailSchema = z.object({
  email: z.email(),
});

export type FindUserByEmailInput = z.infer<typeof findUserByEmailSchema>;

export async function findUserByEmail({ email }: FindUserByEmailInput) {
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .limit(1);

  return {
    user: user ?? null,
  };
}
