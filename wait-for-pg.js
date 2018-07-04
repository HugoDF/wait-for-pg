import { Client } from 'pg';

export const DEFAULT_MAX_ATTEMPTS = 10;
export const DEFAULT_DELAY = 1000; // in ms

const timeout = ms => new Promise(
  resolve => setTimeout(resolve, ms)
);

export async function waitForPostgres({
  databaseUrl = (
    process.env.DATABASE_URL ||
    'postgres://postgres@localhost'
  ),
  maxAttempts = DEFAULT_MAX_ATTEMPTS,
  delay = DEFAULT_DELAY
} = {}) {
  let didConnect = false;
  let retries = 0;
  while (!didConnect) {
    try {
      const client = new Client(databaseUrl);
      await client.connect();
      console.log('Postgres is up');
      client.end();
      didConnect = true;
    } catch (error) {
      retries++;
      if (retries > maxAttempts) {
        throw error;
      }
      console.log('Postgres is unavailable - sleeping');
      await timeout(delay);
    }
  }
}
