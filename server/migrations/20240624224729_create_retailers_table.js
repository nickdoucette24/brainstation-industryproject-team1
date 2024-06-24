/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('retailers', function(table) {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.integer('totalProducts').notNullable();
      table.float('complianceRate').notNullable();
      table.float('averageDeviation').notNullable();
      table.json('topOffendingProducts').notNullable();
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTable('retailers');
  };
  