const config = require("../config/app");

module.exports = {
  development: {
    client: config.connection.client,
    connection: config.connection.development,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations",
      stub: "./migration.template.js"
    },
    seeds: {
      directory: "./seeds/dev"
    }
  }
};
