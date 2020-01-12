const rc = require("rc");
const path = require("path");

//const sqlitePath = path.resolve(__dirname + "/../db/mydb.sqlite");

const config = rc("api", {
  port: "3000",
  secretKey: "secret_key_123_321",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  connection: {
    client: "pg",
    development: {
      host: "postgres",
      database: "fincyan",
      user: "fincyan",
      password: "123123"
    },
    production: {
      host: "postgres",
      database: "strela_dev",
      user: "denis",
      password: "123123"
    }
  },
  staticFolderPath: __dirname + "/../static/"
});

module.exports = config;
