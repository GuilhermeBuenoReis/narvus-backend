import { drizzle } from 'drizzle-orm/node-postgres';
import { env } from "../http/env";

export const db = drizzle(env.DATABASE_URL);