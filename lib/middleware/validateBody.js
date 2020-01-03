import * as Yup from "yup";
import get from "lodash.get";

function getErrors(error) {
  return error.inner.reduce((acc, err) => {
    if (/^[a-z]*[[]{1}[0-9]*[\]]{1}$/.test(err.path)) {
      //if path contain such array path :array[0]
      const keyName = err.path.slice(0, err.path.indexOf("["));
      const index = err.path.slice(
        err.path.indexOf("[") + 1,
        err.path.indexOf("]")
      );
      return acc[keyName]
        ? {
            ...acc,
            [keyName]: { ...acc[keyName], [index]: err.message }
          }
        : { ...acc, [keyName]: { [index]: err.message } };
    } else {
      return {
        ...acc,
        [err.path]: acc[err.path] || [err.message]
      };
    }
  }, {});
}

const validateBody = schema => async (ctx, next) => {
  if (!Yup.isSchema(schema)) await next(ctx);

  const { body } = ctx.request;

  try {
    const result = await schema.validate(body, {
      abortEarly: false,
      context: {
        ...get(ctx, "state.yup", {}),
        koa: ctx
      }
    });
    ctx.request.body = result;

    return next(ctx);
  } catch (error) {
    ctx.body = { errors: getErrors(error) };
    ctx.status = 400;
  }
};

export default validateBody;
