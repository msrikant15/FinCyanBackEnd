import Koa from "koa";
import cors from "@koa/cors";
import logger from "koa-logger";
import koaStatic from "koa-static";
import koaBody from "koa-body";

import arrayQueryParse from "./middleware/arrayQueryParse";

import router from "./route";
import appConfig from "../config/app";

export const initServer = async () => {
  const app = new Koa();

  // Middlewares
  app.use(cors());
  app.use(arrayQueryParse);
  app.use(koaStatic(__dirname + "/../static/"));
  app.use(koaBody({ multipart: true }));

  app.use(logger());
  app.use(router.routes());

  app.listen(appConfig.port, () => {
    console.log("listen", "port ", appConfig.port);
  });
};
