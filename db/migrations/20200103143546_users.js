/**
 * @param {import('bluebird')} Promise
 * @param {import('knex')} knex
 */
exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", t => {
    t.increments().primary();
    t.string("first_name");
    t.string("last_name");
    t.string("age");
    t.string("address");
    t.string("sex");
    t.string("occupation");
    t.string("email").unique();
    t.string("password");
    t.integer("salary"), t.integer("taxes");
    t.integer("additionalIncome");
    t.integer("MEE");
    t.integer("emi");
    t.string("country");
    t.integer("monthlyExpenses");

    t.integer("lifestyleMEE");

    t.json("relationships");
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
