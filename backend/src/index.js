const fastify = require('fastify')({
  logger: { transport: { target: 'pino-pretty' } }
});
require('dotenv').config();

// Swagger
fastify.register(require('@fastify/swagger'), {
  swagger: {
    info: { title: 'DRMS Philippines API', version: '1.0.0' },
    securityDefinitions: { apiKey: { type: 'apiKey', name: 'Authorization', in: 'header' } }
  }
});
fastify.register(require('@fastify/swagger-ui'), { routePrefix: '/docs' });

fastify.register(require('@fastify/cors'));
fastify.register(require('@fastify/jwt'), { secret: process.env.JWT_SECRET || 'drms-secret' });
fastify.register(require('@fastify/multipart'));

fastify.register(require('./middleware/auth'));

// Register all modules
fastify.register(require('./routes/auth'), { prefix: '/api/auth' });
fastify.register(require('./routes/users'), { prefix: '/api/users' });
fastify.register(require('./routes/roles'), { prefix: '/api/roles' });
fastify.register(require('./routes/patients'), { prefix: '/api/patients' });
fastify.register(require('./routes/treatments'), { prefix: '/api/treatments' });
fastify.register(require('./routes/billing'), { prefix: '/api/billing' });
fastify.register(require('./routes/inventory'), { prefix: '/api/inventory' });

fastify.ready(err => {
  if (err) throw err;
  fastify.swagger();
});

fastify.listen({ port: 3000, host: '0.0.0.0' });
