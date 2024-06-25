/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.table('retailers', function(table) {
      table.json('topOffendingProducts'); // Add a JSON column
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.table('retailers', function(table) {
      table.dropColumn('topOffendingProducts');
    });
  };
  