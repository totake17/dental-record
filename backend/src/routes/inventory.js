const db = require('../config/db');

async function inventoryRoutes(fastify, options) {
  fastify.addHook('preHandler', fastify.authorize);

  fastify.get('/', async () => {
    return db('inventory').select('*').orderBy('item_name');
  });

  fastify.post('/', { preHandler: [fastify.hasPermission('inventory:manage')] }, async (request) => {
    const [id] = await db('inventory').insert(request.body).returning('id');
    return { id };
  });

  fastify.put('/:id', { preHandler: [fastify.hasPermission('inventory:manage')] }, async (request) => {
    await db('inventory').where({ id: request.params.id }).update(request.body);
    return { message: 'Updated' };
  });

  fastify.delete('/:id', { preHandler: [fastify.hasPermission('inventory:manage')] }, async (request) => {
    await db('inventory').where({ id: request.params.id }).del();
    return { message: 'Deleted' };
  });
}

module.exports = inventoryRoutes;
