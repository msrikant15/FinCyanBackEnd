/**
 * @param {import('bluebird')} Promise
 * @param {import('knex')} knex
 */
exports.up = function(knex, Promise) {
  return knex.schema.createTable("scenarios", t => {
    t.increments().primary();
    t.json("data");
    t.string("name");
    t.integer("user_id").references("users.id");
  });
};

/**
 * @param {import('bluebird')} Promise
 * @param {import('knex')} knex
 */
exports.down = function(knex, Promise) {
  return knex.schema.dropTable("scenarios");
};
