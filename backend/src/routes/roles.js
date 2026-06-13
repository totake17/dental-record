const db = require('../config/db');

async function roleRoutes(fastify, options) {
  fastify.addHook('preHandler', fastify.authorize);

  // List roles with permissions
  fastify.get('/', { preHandler: [fastify.hasPermission('user:manage')] }, async () => {
    const roles = await db('roles').select('*');
    for (const role of roles) {
      role.permissions = await db('role_permissions')
        .join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
        .where({ role_id: role.id })
        .pluck('permissions.code');
    }
    return roles;
  });

  // Get all available permissions
  fastify.get('/permissions', { preHandler: [fastify.hasPermission('user:manage')] }, async () => {
    return db('permissions').select('*');
  });

  // Create Role
  fastify.post('/', { preHandler: [fastify.hasPermission('user:manage')] }, async (request) => {
    const { name, description, permissions } = request.body;
    const trx = await db.transaction();
    try {
      const [roleId] = await trx('roles').insert({ name, description }).returning('id');
      if (permissions && permissions.length) {
        const permIds = await trx('permissions').whereIn('code', permissions).pluck('id');
        await trx('role_permissions').insert(permIds.map(pid => ({ role_id: roleId, permission_id: pid })));
      }
      await trx.commit();
      return { id: roleId };
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  });

  // Update Role Permissions
  fastify.put('/:id', { preHandler: [fastify.hasPermission('user:manage')] }, async (request) => {
    const { permissions, description } = request.body;
    const trx = await db.transaction();
    try {
      if (description) await trx('roles').where({ id: request.params.id }).update({ description });

      if (permissions) {
        await trx('role_permissions').where({ role_id: request.params.id }).del();
        const permIds = await trx('permissions').whereIn('code', permissions).pluck('id');
        await trx('role_permissions').insert(permIds.map(pid => ({ role_id: request.params.id, permission_id: pid })));
      }
      await trx.commit();
      return { message: 'Role updated' };
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  });
}

module.exports = roleRoutes;
