/**
 * @param {import('bluebird')} Promise
 * @param {import('knex')} knex
 */
exports.up = function(knex, Promise) {
  return knex.schema.createTable("table_name");
};

/**
 * @param {import('bluebird')} Promise
 * @param {import('knex')} knex
 */
exports.down = function(knex, Promise) {
  return knex.schema.dropTable("table_name");
};
