import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';
import type { InferSelectModel } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema';

export async function makeUser(
  override: Partial<InferSelectModel<typeof users>> = {}
) {
  const password = faker.internet.password();
  const passwordHash = await bcrypt.hash(password, 8);

  const [row] = await db
    .insert(users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash,
      avatarUrl: faker.image.avatarGitHub(),
      ...override,
    })
    .returning();

  return { ...row, password };
}
