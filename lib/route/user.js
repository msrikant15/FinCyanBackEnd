import Router from "koa-router";
import * as Yup from "yup";
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

router.post("/user-info/:id", async ctx => {
  const userId = ctx.params.id;
  console.log(ctx.request.body);
  await knex("users")
    .where("id", userId)
    .update({ ...ctx.request.body });
  ctx.body = {
    userId
  };
});

router.get("/user-info/:id", async ctx => {
  const userId = ctx.params.id;
  const user = await knex("users")
    .where("id", userId)
    .first();

  ctx.body = user;
});
export default router;
