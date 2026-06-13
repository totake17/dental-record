const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function userRoutes(fastify, options) {
  fastify.addHook('preHandler', fastify.authorize);

  // List all users
  fastify.get('/', { preHandler: [fastify.hasPermission('user:manage')] }, async () => {
    return db('users')
      .join('roles', 'users.role_id', '=', 'roles.id')
      .select('users.id', 'users.username', 'users.full_name', 'users.is_active', 'roles.name as role_name', 'users.role_id');
  });

  // Create User
  fastify.post('/', { preHandler: [fastify.hasPermission('user:manage')] }, async (request, reply) => {
    const { username, password, full_name, role_id } = request.body;
    const password_hash = await bcrypt.hash(password, 10);
    const [id] = await db('users').insert({ username, password_hash, full_name, role_id }).returning('id');
    return { id, message: 'User created' };
  });

  // Update User
  fastify.put('/:id', { preHandler: [fastify.hasPermission('user:manage')] }, async (request) => {
    const { password, ...data } = request.body;
    if (password) {
      data.password_hash = await bcrypt.hash(password, 10);
    }
    await db('users').where({ id: request.params.id }).update(data);
    return { message: 'User updated' };
  });

  // Deactivate User (Soft Delete)
  fastify.delete('/:id', { preHandler: [fastify.hasPermission('user:manage')] }, async (request) => {
    await db('users').where({ id: request.params.id }).update({ is_active: false });
    return { message: 'User deactivated' };
  });

  // Change own password
  fastify.post('/change-password', async (request, reply) => {
    const { old_password, new_password } = request.body;
    const user = await db('users').where({ id: request.user.id }).first();

    if (!(await bcrypt.compare(old_password, user.password_hash))) {
      return reply.code(400).send({ error: 'Incorrect old password' });
    }

    const password_hash = await bcrypt.hash(new_password, 10);
    await db('users').where({ id: request.user.id }).update({ password_hash });
    return { message: 'Password changed successfully' };
  });
}

module.exports = userRoutes;
