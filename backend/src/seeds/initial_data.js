const bcrypt = require('bcryptjs');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function(knex) {
  // Clear existing data
  await knex('invoice_items').del();
  await knex('invoices').del();
  await knex('procedure_inventory').del();
  await knex('inventory').del();
  await knex('treatment_records').del();
  await knex('procedures').del();
  await knex('users').del();
  await knex('role_permissions').del();
  await knex('permissions').del();
  await knex('roles').del();

  // 1. Roles
  const roles = [
    { name: 'Admin', description: 'System Administrator' },
    { name: 'Dentist', description: 'Dental Professional' },
    { name: 'Receptionist', description: 'Clinic Receptionist' }
  ];
  const [adminRole, dentistRole, receptionRole] = await knex('roles').insert(roles).returning('*');

  // 2. Permissions
  const perms = [
    { code: 'patient:view', description: 'View patients' },
    { code: 'patient:create', description: 'Create patients' },
    { code: 'clinical:record', description: 'Record treatments' },
    { code: 'billing:manage', description: 'Manage billing' },
    { code: 'inventory:manage', description: 'Manage inventory' }
  ];
  const createdPerms = await knex('permissions').insert(perms).returning('*');

  // Link all to Admin
  await knex('role_permissions').insert(createdPerms.map(p => ({ role_id: adminRole.id, permission_id: p.id })));
  // Link some to Dentist
  const dentistPerms = createdPerms.filter(p => ['patient:view', 'clinical:record'].includes(p.code));
  await knex('role_permissions').insert(dentistPerms.map(p => ({ role_id: dentistRole.id, permission_id: p.id })));

  // 3. Users
  const pwd = await bcrypt.hash('password123', 10);
  await knex('users').insert([
    { username: 'admin', password_hash: pwd, full_name: 'System Admin', role_id: adminRole.id },
    { username: 'dentist1', password_hash: pwd, full_name: 'Dr. Jose Rizal', role_id: dentistRole.id },
    { username: 'staff1', password_hash: pwd, full_name: 'Maria Clara', role_id: receptionRole.id }
  ]);

  // 4. Inventory
  const [anesthesia, gauze, composite] = await knex('inventory').insert([
    { item_name: 'Local Anesthesia', quantity: 50, unit: 'vial', low_stock_threshold: 5 },
    { item_name: 'Sterile Gauze', quantity: 200, unit: 'pcs', low_stock_threshold: 20 },
    { item_name: 'Composite Resin', quantity: 30, unit: 'tube', low_stock_threshold: 3 }
  ]).returning('*');

  // 5. Procedures
  const [exam, extraction, filling] = await knex('procedures').insert([
    { name: 'Oral Examination', base_price: 500 },
    { name: 'Tooth Extraction', base_price: 1200 },
    { name: 'Composite Filling', base_price: 1500 }
  ]).returning('*');

  // 6. Link Procedures to Inventory
  await knex('procedure_inventory').insert([
    { procedure_id: extraction.id, inventory_id: anesthesia.id, quantity_used: 1 },
    { procedure_id: extraction.id, inventory_id: gauze.id, quantity_used: 5 },
    { procedure_id: filling.id, inventory_id: composite.id, quantity_used: 1 },
    { procedure_id: filling.id, inventory_id: gauze.id, quantity_used: 2 }
  ]);
};
