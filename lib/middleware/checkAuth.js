import jwtMiddleware from "koa-jwt";
import config from "../../config/app";

import { getUserById } from "../repo/users";

export async function checkAuth(ctx, next) {
  return jwtMiddleware({ key: "jwt", secret: config.secretKey })(
    ctx,
    async () => {
      console.log(ctx.state, "state");

      const { id: userId } = ctx.state.jwt;

      if (!userId) ctx.throw(401);

      const user = await getUserById(userId);

      ctx.state.user = {
        ...user
      };
      await next();
    }
  );
}

//works after authorizaton
export const applyRoleFilters = ({ statusCategory, countryCategory }) => async (
  ctx,
  next
) => {
  const { accesses } = ctx.state.user;
  const oldFilters = ctx.query.filters ? JSON.parse(ctx.query.filters) : {};
  const statusFilters = statusCategory
    ? accesses
        .filter(a => a.categories === statusCategory)
        .map(a => a.key.slice(a.key.indexOf("_") + 1)) //remove name of entity at the begining of key
    : oldFilters.status;

  const countryFilters = countryCategory
    ? accesses.filter(a => a.categories === countryCategory).map(a => a.key)
    : oldFilters.country;

  const newFilters = {
    ...oldFilters,
    status:
      //if there is custom filters and they are in allowed filters list we use them
      oldFilters.status && statusFilters.includes(oldFilters.status)
        ? oldFilters.status
        : statusFilters,
    country:
      oldFilters.country && countryFilters.includes(oldFilters.country)
        ? oldFilters.country
        : countryFilters
  };
  ctx.query.filters = JSON.stringify(newFilters);
  await next();
};

// Реализация проверки ролей с другого проекта, оставил для наглядности при расширении функционала

// const { User } = require('../db');
// const jwtMiddleware = require('koa-jwt');
// const { secret } = require('../config');

// const checkRole = roles => async (ctx, next) =>
//   jwtMiddleware({ secret, key: 'jwt' })(ctx, async () => {
//     const userId = ctx.state.jwt.id;
//     const user = await User.findById(userId, {
//       attributes: { exclude: 'password' },
//       include: {
//         model: User,
//         as: 'Assistant',
//         attributes: ['name', 'email', 'phone', 'telegram'],
//       },
//     }).then(user => user.get({ plain: true }));

//     if (Array.isArray(roles) && !roles.includes(user.role)) ctx.throw(403);
//     if (typeof roles === 'string' && roles !== user.role) ctx.throw(403);

//     ctx.state.user = user;
//     await next();
//   });

// module.exports = checkRole;
