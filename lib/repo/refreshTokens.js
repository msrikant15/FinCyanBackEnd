import uuid from "uuid/v4";
import knex from "../../db/knex";

export async function createRefreshToken(userId) {
  const data = { id: uuid(), user_id: userId };

  await knex("refresh_tokens").insert(data);

  return data;
}

export function getRefreshToken(refreshToken) {
  return knex("refresh_tokens")
    .where({ id: refreshToken })
    .first();
}

export function deleteRefreshToken(refreshToken) {
  return knex("refresh_tokens")
    .where({ id: refreshToken })
    .del();
}

export async function createClientRefreshToken(clientId) {
  const data = {
    id: uuid(),
    client_id: clientId
  };

  await knex("clients_refresh_tokens").insert(data);

  return data;
}

export async function getClientRefreshToken(refreshToken) {
  return knex("clients_refresh_tokens")
    .where({ id: refreshToken })
    .first();
}

export function deleteClientRefreshToken(refreshToken) {
  return knex("clients_refresh_tokens")
    .where({ id: refreshToken })
    .del();
}
