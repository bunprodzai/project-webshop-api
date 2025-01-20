
const cartRoute = require("./cart.route");
const productRoute = require("./product.route");
const searchRoute = require("./search.route");
const homeRoute = require("./home.route");
const userRoute = require("./user.route");
const checkoutRoute = require("./checkout.route");
const settingRoute = require("./setting-general.route");
const articleRoute = require("./article.route");
const productCategoryRoute = require("./product-category.route");

module.exports = (app) => {


  app.use(`/api/v1/cart`, cartRoute);
  app.use(`/api/v1/products`, productRoute);
  app.use(`/api/v1/search`, searchRoute);
  app.use(`/api/v1`, homeRoute);
  app.use(`/api/v1/users`, userRoute);
  app.use(`/api/v1/checkout`, checkoutRoute);
  app.use(`/api/v1/settings`, settingRoute);
  app.use(`/api/v1/articles`, articleRoute);
  app.use(`/api/v1/products-category`, productCategoryRoute);
}