import Router from "koa-router";
import * as Yup from "yup";

import { getUserByEmail } from "../repo/users";

import {
  deleteRefreshToken,
  createRefreshToken,
  getRefreshToken
} from "../repo/refreshTokens";
import { createAccessToken } from "../helpers/accessTokens";

import { checkPassword } from "../helpers/password";
import validateBody from "../middleware/validateBody";
import knex from "../../db/knex";

const Schema = Yup.object().shape({
  login: Yup.string()
    .required("Логин обязателен для заполнения")
    .test("not-found-login", "Такого логина не существует", function() {
      const { user } = this.options.context;
      return Boolean(user);
    }),
  password: Yup.string()
    .required("Пароль обязателен для заполнения")
    .when("$user", (user, schema) =>
      user
        ? schema.test("check-password", "Неверный пароль", val =>
            checkPassword(val, user.password)
          )
        : schema
    )
});

const router = new Router();

router.post(
  "/sign-in",
  async (ctx, next) => {
    const { login } = ctx.request.body;
    const user = await getUserByEmail(login);
    ctx.state.yup = { user };
    await next(ctx);
  },
  validateBody(Schema),
  async ctx => {
    const { user } = ctx.state.yup;
    const { id: userId } = user;

    delete user.password;

    const { id: refreshToken } = await createRefreshToken(userId);

    ctx.body = {
      accessToken: createAccessToken(userId),
      refreshToken,
      user
    };
  }
);

router.post("/sign-out", async ctx => {
  const { refreshToken } = ctx.request.body;
  await deleteRefreshToken(refreshToken);
  ctx.status = 200;
});

router.post("/refresh", async ctx => {
  const { refreshToken } = ctx.request.body;

  const oldRefreshToken = await getRefreshToken(refreshToken);
  if (!oldRefreshToken) ctx.throw(401);

  const userId = oldRefreshToken.user_id;

  await deleteRefreshToken(refreshToken);

  const { id: newRefreshToken } = await createRefreshToken(userId);

  ctx.body = {
    accessToken: createAccessToken(userId),
    refreshToken: newRefreshToken
  };
});

export default router;
