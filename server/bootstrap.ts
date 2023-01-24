import transformMiddleware from './middlewares/transform';

export default ({ strapi }) => {
  // bootstrap phase
  transformMiddleware({ strapi });
};

