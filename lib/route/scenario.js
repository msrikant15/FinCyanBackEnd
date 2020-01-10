import Router from "koa-router";
import * as Yup from "yup";
import knex from "../../db/knex";
import { checkAuth } from "../middleware/checkAuth";
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

router.get("/", checkAuth, async ctx => {
  const data = await knex("scenarios").where("user_id", ctx.state.user.id);

  ctx.body = data;
});

router.post("/add", checkAuth, async ctx => {
  //   const userId = ctx.params.id;
  console.log(ctx.state, "user");
  const data = await knex("scenarios").insert({
    data: ctx.request.body.data,
    name: ctx.request.body.name,
    user_id: ctx.state.user.id
  });
  ctx.body = {
    data
  };
});

router.put("/update/:id", async ctx => {
  const userId = ctx.params.id;
  const user = await knex("users")
    .where("id", userId)
    .first();

  ctx.body = user;
});
router.delete("/:id", checkAuth, async ctx => {
  const id = ctx.params.id;
  const scenarios = await knex("scenarios")
    .where("id", id)
    .delete();

  ctx.body = scenarios;
});
export default router;
