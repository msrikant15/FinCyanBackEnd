/**
 * @param {import('bluebird')} Promise
 * @param {import('knex')} knex
 */
exports.up = function(knex, Promise) {
  return knex.schema.createTable("refresh_tokens", table => {
    table.uuid("id").primary();
    table
      .integer("user_id")
      .references("users.id")
      .notNullable();
  });
};

/**
 * @param {import('bluebird')} Promise
 * @param {import('knex')} knex
 */
exports.down = function(knex, Promise) {
  return knex.schema.dropTable("refresh_tokens");
};
