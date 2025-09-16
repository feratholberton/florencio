import Fastify from 'fastify';

/**
 * buildApp creates and configures a Fastify instance.
 * Keeping this separate from "listen" makes it easy to test.
 */
export function buildApp() {
  const app = Fastify({
    logger: true
  });

  // Health route: used by load balancers / orchestrators to check liveness.
  app.get('/v1/health', async () => {
    return { status: 'ok' };
  });

  return app;
}
