const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

async function patientRoutes(fastify, options) {
  fastify.addHook('preHandler', fastify.authorize);

  fastify.get('/', { preHandler: [fastify.hasPermission('patient:view')] }, async () => {
    const patients = await db('patients').select('*');
    return patients.map(p => ({
      ...p,
      first_name: decrypt(p.first_name),
      last_name: decrypt(p.last_name),
      middle_name: decrypt(p.middle_name),
      address: decrypt(p.address),
      contact_number: decrypt(p.contact_number)
    }));
  });

  fastify.get('/:id', { preHandler: [fastify.hasPermission('patient:view')] }, async (request, reply) => {
    const p = await db('patients').where({ id: request.params.id }).first();
    if (!p) return reply.code(404).send({ error: 'Not found' });
    return {
      ...p,
      first_name: decrypt(p.first_name),
      last_name: decrypt(p.last_name),
      middle_name: decrypt(p.middle_name),
      address: decrypt(p.address),
      contact_number: decrypt(p.contact_number),
      medical_history: decrypt(p.medical_history),
      allergies: decrypt(p.allergies)
    };
  });

  fastify.post('/', { preHandler: [fastify.hasPermission('patient:create')] }, async (request) => {
    const data = request.body;
    const enc = {
      ...data,
      first_name: encrypt(data.first_name),
      last_name: encrypt(data.last_name),
      middle_name: encrypt(data.middle_name || ''),
      address: encrypt(data.address || ''),
      contact_number: encrypt(data.contact_number || ''),
      medical_history: encrypt(data.medical_history || ''),
      allergies: encrypt(data.allergies || '')
    };
    const [id] = await db('patients').insert(enc).returning('id');
    return { id };
  });

  fastify.put('/:id', { preHandler: [fastify.hasPermission('patient:create')] }, async (request) => {
    const data = request.body;
    const enc = {
      ...data,
      first_name: encrypt(data.first_name),
      last_name: encrypt(data.last_name),
      middle_name: encrypt(data.middle_name || ''),
      address: encrypt(data.address || ''),
      contact_number: encrypt(data.contact_number || ''),
      medical_history: encrypt(data.medical_history || ''),
      allergies: encrypt(data.allergies || ''),
      updated_at: new Date()
    };
    await db('patients').where({ id: request.params.id }).update(enc);
    return { message: 'Updated' };
  });

  fastify.delete('/:id', { preHandler: [fastify.hasPermission('patient:delete')] }, async (request) => {
    await db('patients').where({ id: request.params.id }).del();
    return { message: 'Deleted' };
  });
}

module.exports = patientRoutes;
