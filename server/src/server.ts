import { buildApp } from './app.js';

const app = buildApp();

const PORT = Number(process.env.PORT ?? 3000);
const HOST = process.env.HOST ?? '0.0.0.0';

app.listen({ port: PORT, host: HOST })
  .then(() => {
    app.log.info({ port: PORT, host: HOST }, 'Sessions API is up');
  })
  .catch((err) => {
    app.log.error({ err }, 'Failed to start server');
    process.exit(1);
  });
