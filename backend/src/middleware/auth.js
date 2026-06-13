const fp = require('fastify-plugin');

module.exports = fp(async function(fastify, opts) {
  fastify.decorate('authorize', async function(request, reply) {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.code(401).send({ error: 'Unauthorized' });
    }
  });

  fastify.decorate('hasPermission', function(permission) {
    return async (request, reply) => {
      const user = request.user;
      if (!user.permissions || !user.permissions.includes(permission)) {
        reply.code(403).send({ error: 'Forbidden: Insufficient permissions' });
      }
    };
  });
});
