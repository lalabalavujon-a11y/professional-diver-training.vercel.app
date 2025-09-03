import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSQLite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";
import * as sqliteSchema from "@shared/schema-sqlite";

neonConfig.webSocketConstructor = ws;

// Support both local SQLite development and production PostgreSQL
let db: any;

if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) {
  // Use local SQLite for development
  console.log('🔧 Using local SQLite database for development');
  const sqlite = new Database('./local-dev.db');
  db = drizzleSQLite(sqlite, { schema: sqliteSchema });
} else {
  // Use PostgreSQL for production
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set for production. Did you forget to provision a database?",
    );
  }
  console.log('🚀 Using PostgreSQL database for production');
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
}

export { db };