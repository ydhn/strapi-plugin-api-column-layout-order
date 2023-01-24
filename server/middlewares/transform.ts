const isAPIRequest = (ctx) =>
  ctx.state &&
  ctx.state.route &&
  ctx.state.route.info &&
  ctx.state.route.info.type === 'content-api';

const deepFlatten = function (array){
  let result = [];
  array.forEach(function (elem) {
    if (Array.isArray(elem)) {
      result = result.concat(deepFlatten(elem));
    } else {
      result.push(elem);
    }
  });
  return result;
};

const transform = async (strapi, ctx, next) => {
  await next();

  if (!ctx.body) return; // ensure body exists, occurs on non existent route
  if (!isAPIRequest(ctx)) return; // only process api requests.
  if (!ctx.body.data?.['attributes']) return; // ensure no error returned.
  try {
    const apiName = ctx.state.route.info.apiName
    const uid = `api::${apiName}.${apiName}`;
    const store = strapi.store({ type: 'plugin', name: 'content_manager' });
    const contentType = await store.get({ key: `configuration_content_types::${uid}` })
    let newResult: Record<string, any> = {};
    for (const columns of deepFlatten(contentType.layouts.edit)) {
      newResult[columns.name] = ctx.body.data.attributes[columns.name];
    }
    newResult = { ...newResult, ...ctx.body.data.attributes };
    ctx.body.data['attributes'] = newResult;
  } catch (e) {
    // @ts-ignore
    console.error(e);
  }
}

export default ({ strapi }) => {
  strapi.server.use((ctx, next) => transform(strapi, ctx, next));
};
