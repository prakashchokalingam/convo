import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('local.db');
export const db = drizzle(sqlite, { schema });

// For production with Turso:
// import { drizzle } from 'drizzle-orm/libsql';
// import { createClient } from '@libsql/client';
// 
// const client = createClient({
//   url: process.env.DATABASE_URL!,
//   authToken: process.env.DATABASE_AUTH_TOKEN,
// });
// 
// export const db = drizzle(client, { schema });
