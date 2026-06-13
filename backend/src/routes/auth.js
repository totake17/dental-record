const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function authRoutes(fastify, options) {
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body;
    const user = await db('users')
      .join('roles', 'users.role_id', '=', 'roles.id')
      .where({ username, is_active: true })
      .select('users.*', 'roles.name as role_name')
      .first();

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return reply.code(401).send({ error: 'Invalid credentials' });
    }

    const permissions = await db('role_permissions')
      .join('permissions', 'role_permissions.permission_id', '=', 'permissions.id')
      .where({ role_id: user.role_id })
      .pluck('permissions.code');

    const token = fastify.jwt.sign({
      id: user.id,
      username: user.username,
      role: user.role_name,
      permissions
    }, { expiresIn: '8h' });

    return { token, user: { id: user.id, username: user.username, role: user.role_name, permissions } };
  });
}

module.exports = authRoutes;
