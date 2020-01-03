import Knex from "knex";
import config from "../config/app";

const knex = Knex({
  client: config.connection.client,
  connection: config.connection[config.mode],
  useNullAsDefault: true,
  debug: true
});

export default knex;
