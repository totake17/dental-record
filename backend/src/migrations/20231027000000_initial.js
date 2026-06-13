exports.up = function(knex) {
  return knex.schema
    .createTable('roles', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable().unique();
      table.string('description');
      table.timestamps(true, true);
    })
    .createTable('permissions', (table) => {
      table.increments('id').primary();
      table.string('code').notNullable().unique();
      table.string('description');
      table.timestamps(true, true);
    })
    .createTable('role_permissions', (table) => {
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE');
      table.integer('permission_id').unsigned().references('id').inTable('permissions').onDelete('CASCADE');
      table.primary(['role_id', 'permission_id']);
    })
    .createTable('users', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable().unique();
      table.string('password_hash').notNullable();
      table.string('full_name').notNullable();
      table.integer('role_id').unsigned().references('id').inTable('roles');
      table.boolean('is_active').defaultTo(true);
      table.timestamps(true, true);
    })
    .createTable('patients', (table) => {
      table.increments('id').primary();
      table.text('first_name').notNullable();
      table.text('last_name').notNullable();
      table.text('middle_name');
      table.date('birth_date');
      table.string('gender');
      table.text('address');
      table.text('contact_number');
      table.string('philhealth_id');
      table.text('medical_history');
      table.text('allergies');
      table.integer('version').defaultTo(1);
      table.timestamps(true, true);
    })
    .createTable('procedures', (table) => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.decimal('base_price', 10, 2).notNullable();
      table.timestamps(true, true);
    })
    .createTable('treatment_records', (table) => {
      table.increments('id').primary();
      table.integer('patient_id').unsigned().references('id').inTable('patients');
      table.integer('dentist_id').unsigned().references('id').inTable('users');
      table.integer('procedure_id').unsigned().references('id').inTable('procedures');
      table.text('clinical_notes');
      table.decimal('price_at_visit', 10, 2).notNullable();
      table.dateTime('visit_date').defaultTo(knex.fn.now());
      table.timestamps(true, true);
    })
    .createTable('inventory', (table) => {
      table.increments('id').primary();
      table.string('item_name').notNullable();
      table.integer('quantity').defaultTo(0);
      table.integer('low_stock_threshold').defaultTo(5);
      table.string('unit');
      table.timestamps(true, true);
    })
    .createTable('procedure_inventory', (table) => {
      table.integer('procedure_id').unsigned().references('id').inTable('procedures');
      table.integer('inventory_id').unsigned().references('id').inTable('inventory');
      table.integer('quantity_used').defaultTo(1);
      table.primary(['procedure_id', 'inventory_id']);
    })
    .createTable('invoices', (table) => {
      table.increments('id').primary();
      table.integer('patient_id').unsigned().references('id').inTable('patients');
      table.dateTime('invoice_date').defaultTo(knex.fn.now());
      table.decimal('total_amount', 10, 2).notNullable();
      table.string('payment_status').defaultTo('unpaid');
      table.timestamps(true, true);
    })
    .createTable('invoice_items', (table) => {
      table.increments('id').primary();
      table.integer('invoice_id').unsigned().references('id').inTable('invoices').onDelete('CASCADE');
      table.integer('treatment_record_id').unsigned().references('id').inTable('treatment_records');
      table.decimal('amount', 10, 2).notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists('invoice_items')
    .dropTableIfExists('invoices')
    .dropTableIfExists('procedure_inventory')
    .dropTableIfExists('inventory')
    .dropTableIfExists('treatment_records')
    .dropTableIfExists('procedures')
    .dropTableIfExists('patients')
    .dropTableIfExists('users')
    .dropTableIfExists('role_permissions')
    .dropTableIfExists('permissions')
    .dropTableIfExists('roles');
};
