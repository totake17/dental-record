const fastify = require('fastify')({
  logger: { transport: { target: 'pino-pretty' } }
});
const path = require('path');
require('dotenv').config();

fastify.register(require('@fastify/cors'));
fastify.register(require('@fastify/jwt'), { secret: process.env.JWT_SECRET || 'drms-secret' });
fastify.register(require('@fastify/multipart'));

fastify.register(require('./middleware/auth'));

fastify.register(require('./routes/auth'), { prefix: '/api/auth' });
fastify.register(require('./routes/patients'), { prefix: '/api/patients' });
fastify.register(require('./routes/treatments'), { prefix: '/api/treatments' });
fastify.register(require('./routes/billing'), { prefix: '/api/billing' });

fastify.listen({ port: 3000, host: '0.0.0.0' });
