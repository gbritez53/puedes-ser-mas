import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: import.meta.env.TURSO_DATABASE_URL as string,
  authToken: import.meta.env.TURSO_AUTH_TOKEN as string,
});

export const db = drizzle(client, { schema });
