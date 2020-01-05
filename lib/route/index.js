import Router from "koa-router";
import koaBody from "koa-bodyparser";

const appRouter = new Router();

appRouter.use(koaBody());

const routes = {
  "/auth": require("./auth").default,
  "/user": require("./user").default
};

Object.keys(routes).forEach(key => {
  const router = routes[key];
  appRouter.use(key, router.routes(), router.allowedMethods());
});

export default appRouter;
