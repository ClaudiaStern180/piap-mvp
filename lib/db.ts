import { Pool, type QueryResultRow } from 'pg';

let pool: Pool | null = null;

export function isMockMode(): boolean {
  return process.env.USE_MOCK_DATA === 'true' || !process.env.DATABASE_URL;
}

export function getPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not configured. Set DATABASE_URL or USE_MOCK_DATA=true.');
  }
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSLMODE === 'require' ? { rejectUnauthorized: false } : undefined,
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  return getPool().query<T>(text, params);
}
