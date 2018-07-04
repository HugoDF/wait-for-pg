import {
  waitForPostgres,
  DEFAULT_MAX_ATTEMPTS,
  DEFAULT_DELAY
} from './wait-for-pg';
import meow from 'meow';

const cli = meow(`
    Usage
      $ wait-for-pg <DATABASE_URL>

    Options
      --max-attempts, -c Maximum number of attempts, default: ${DEFAULT_MAX_ATTEMPTS}
      --delay, -d Delay between connection attempts in ms, default: ${DEFAULT_DELAY}

    Examples
      $ wait-for-pg postgres://postgres@localhost:5432 -c 5 -d 3000 && npm start
      # waits for postgres, 5 attempts at a 3s interval, if
      # postgres becomes available, run 'npm start'
`, {
    inferType: true,
    flags: {
      maxAttempts: {
        type: 'string',
        alias: 'c'
      },
      delay: {
        type: 'string',
        alias: 'd'
      }
    }
  });


try {
  await waitForPostgres({
    databaseUrl: cli.input[0],
    maxAttempts: cli.flags.maxAttempts,
    delay: cli.flags.delay,
  });
  process.exit(0);
} catch (error) {
  process.exit(1);
}
