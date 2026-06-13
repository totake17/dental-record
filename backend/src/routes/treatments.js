const db = require('../config/db');

async function treatmentRoutes(fastify, options) {
  fastify.addHook('preHandler', fastify.authorize);

  fastify.get('/procedures', async () => {
    return db('procedures').select('*');
  });

  fastify.post('/record', { preHandler: [fastify.hasPermission('clinical:record')] }, async (request, reply) => {
    const { patient_id, procedures, clinical_notes } = request.body;
    const dentist_id = request.user.id;

    const trx = await db.transaction();
    try {
      const records = [];
      for (const proc of procedures) {
        const [recordId] = await trx('treatment_records').insert({
          patient_id,
          dentist_id,
          procedure_id: proc.id,
          clinical_notes,
          price_at_visit: proc.base_price,
          visit_date: new Date()
        }).returning('id');
        records.push(recordId);

        // Inventory deduction
        const items = await trx('procedure_inventory').where({ procedure_id: proc.id });
        for (const item of items) {
          await trx('inventory').where({ id: item.inventory_id }).decrement('quantity', item.quantity_used);
        }
      }
      await trx.commit();
      return { ids: records, message: 'Clinical records saved and inventory updated.' };
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  });

  fastify.get('/history/:patientId', async (request) => {
    return db('treatment_records')
      .join('procedures', 'treatment_records.procedure_id', '=', 'procedures.id')
      .join('users', 'treatment_records.dentist_id', '=', 'users.id')
      .where({ patient_id: request.params.patientId })
      .select('treatment_records.*', 'procedures.name as procedure_name', 'users.full_name as dentist_name')
      .orderBy('visit_date', 'desc');
  });
}

module.exports = treatmentRoutes;
