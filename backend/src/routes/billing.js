const db = require('../config/db');

async function billingRoutes(fastify, options) {
  fastify.addHook('preHandler', fastify.authorize);

  // Get pending treatments (not yet invoiced) for a patient
  fastify.get('/pending/:patientId', async (request) => {
    return db('treatment_records')
      .leftJoin('invoice_items', 'treatment_records.id', '=', 'invoice_items.treatment_record_id')
      .where({ patient_id: request.params.patientId })
      .whereNull('invoice_items.id')
      .join('procedures', 'treatment_records.procedure_id', '=', 'procedures.id')
      .select('treatment_records.*', 'procedures.name as procedure_name');
  });

  // Create Invoice
  fastify.post('/invoices', { preHandler: [fastify.hasPermission('billing:manage')] }, async (request, reply) => {
    const { patient_id, treatment_record_ids, total_amount } = request.body;

    const trx = await db.transaction();
    try {
      const [invoiceId] = await trx('invoices').insert({
        patient_id,
        total_amount,
        payment_status: 'unpaid'
      }).returning('id');

      const items = treatment_record_ids.map(trId => ({
        invoice_id: invoiceId,
        treatment_record_id: trId,
        amount: 0 // In a real system, we'd fetch price_at_visit from treatment_records
      }));

      // Update amount from treatment_records
      for(let trId of treatment_record_ids) {
          const tr = await trx('treatment_records').where({id: trId}).first();
          await trx('invoice_items').insert({
              invoice_id: invoiceId,
              treatment_record_id: trId,
              amount: tr.price_at_visit
          });
      }

      await trx.commit();
      return { id: invoiceId };
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  });

  fastify.get('/invoices/:id', async (request) => {
    const invoice = await db('invoices')
      .join('patients', 'invoices.patient_id', '=', 'patients.id')
      .where('invoices.id', request.params.id)
      .select('invoices.*', 'patients.first_name', 'patients.last_name', 'patients.philhealth_id')
      .first();

    const items = await db('invoice_items')
      .join('treatment_records', 'invoice_items.treatment_record_id', '=', 'treatment_records.id')
      .join('procedures', 'treatment_records.procedure_id', '=', 'procedures.id')
      .where('invoice_id', request.params.id)
      .select('invoice_items.*', 'procedures.name as procedure_name');

    return { ...invoice, items };
  });
}

module.exports = billingRoutes;
