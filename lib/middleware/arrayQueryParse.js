const arrayQueryParse = async (ctx, next) => {
  const { query } = ctx;
  const arraysKeys = Object.keys(query).filter(key => key.includes("[]"));

  arraysKeys.forEach(arrayKey => {
    const data = query[arrayKey];
    const newKey = arrayKey.slice(0, -2);

    if (Array.isArray(data)) ctx.query[newKey] = data;
    else ctx.query[newKey] = [data];

    delete ctx.query[arrayKey];
  });

  await next(ctx);
};

export default arrayQueryParse;
