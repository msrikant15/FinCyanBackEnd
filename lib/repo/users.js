import knex from "../../db/knex";

import { createPassword } from "../helpers/password";
import generateCode from "../helpers/generateCode";

export async function getUserById(id, withPassword = false) {
  const user = await knex("users")
    .where({ id })
    .first();

  if (!withPassword) delete user.password;
  return user;
}

export async function getFullUserDataById(id) {
  return knex.transaction(async tx => {
    try {
      const user = await tx("users")
        .where({ id })
        .first();

      if (!user) tx.commit(null);

      const affiliates = await tx("affiliates_users")
        .from("affiliates_users as mixed")
        .where("mixed.user_id", id)
        .join("affiliates as a", "mixed.affiliate_id", "=", "a.id")
        .select("a.name", "a.id");

      const data = {
        ...user,
        password: undefined,
        affiliates
      };

      await tx.commit(data);
    } catch (error) {
      await tx.rollback(error);
    }
  });
}

export function getUsers() {
  return knex("users");
}

export function getUserByEmail(email) {
  return knex("users")
    .where("email", email)
    .select(
      "first_name",
      "last_name",
      "email",
      "code",
      "address",
      "password",
      "id"
    )
    .first();
}

export function findUserByCode(code) {
  return knex("users")
    .where({ code })
    .first();
}

export async function createUser(data) {
  const code = await generateCode(findUserByCode);
  delete data.affiliates;

  const ids = await knex("users")
    .insert({
      ...data,
      password: createPassword(data.password),
      code
    })
    .returning("id");

  return knex("users").whereIn("id", ids);
}

export async function updateUser(userId, userData) {
  return knex.transaction(async tx => {
    try {
      const { affiliates, ...data } = userData;

      await tx("users")
        .where({ id: userId })
        .update(data);

      await tx("affiliates_users")
        .where({ user_id: userId })
        .del();

      if (Array.isArray(affiliates) && affiliates.length > 0) {
        await Promise.all(
          affiliates.map(af =>
            tx("affiliates_users").insert({
              user_id: userId,
              affiliate_id: af.id
            })
          )
        );
      }

      await tx.commit();
    } catch (error) {
      await tx.rollback(error);
    }
  });
}

export async function updateUsersPassword(userId, password) {
  await knex("users")
    .where({ id: userId })
    .update({ password: createPassword(password) });
}
