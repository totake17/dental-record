const db = require('../config/db');
const { encrypt, decrypt } = require('../utils/encryption');

async function patientRoutes(fastify, options) {
  fastify.addHook('preHandler', fastify.authorize);

  fastify.get('/', { preHandler: [fastify.hasPermission('patient:view')] }, async (request, reply) => {
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

  fastify.post('/', { preHandler: [fastify.hasPermission('patient:create')] }, async (request, reply) => {
    const data = request.body;
    const encryptedData = {
      ...data,
      first_name: encrypt(data.first_name),
      last_name: encrypt(data.last_name),
      middle_name: encrypt(data.middle_name),
      address: encrypt(data.address),
      contact_number: encrypt(data.contact_number),
      medical_history: encrypt(data.medical_history),
      allergies: encrypt(data.allergies)
    };
    const [id] = await db('patients').insert(encryptedData).returning('id');
    return { id };
  });
}

module.exports = patientRoutes;
