import { eq } from 'drizzle-orm';
import { db } from '../db';
import { schema } from '../db/schema';
import { UserNotFoundError } from '../errors/user-not-found-error';

interface DeleteUserInput {
  userId: string;
}

export async function deleteUser({ userId }: DeleteUserInput) {
  const result = await db.delete(schema.users).where(eq(schema.users.id, userId)).returning();

  if (result.length === 0) {
    throw new UserNotFoundError(userId);
  }

  return {
    success: true,
  };
}
