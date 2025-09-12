import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const revokedTokens = pgTable('revoked_tokens', {
  token: text('token').primaryKey(),
  revoked_at: timestamp('revoked_at').defaultNow().notNull(),
});
