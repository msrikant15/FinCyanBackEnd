/**
 * @param {import('bluebird')} Promise
 * @param {import('knex')} knex
 */
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", t => {
    t.increments().primary();
    t.string("first_name");
    t.string("last_name");
    t.string("patronymic");
    t.string("address");
    t.string("email").unique();
    t.string("password");
    t.json("relationship");
    t.json("regular_expenses");
    t.json("assets");
    t.timestamps(true, true);
    t.integer("code").unique();
  });
};

/**
 * @param {import('bluebird')} Promise
 * @param {import('knex')} knex
 */
exports.down = function(knex, Promise) {
  return knex.schema.dropTable("users");
};
