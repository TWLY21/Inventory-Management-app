const app = require('./app');
const env = require('./config/env');
const db = require('./db');

async function bootstrap() {
  await db.query('SELECT 1');

  app.listen(env.port, () => {
    console.log(`Inventory API listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});

