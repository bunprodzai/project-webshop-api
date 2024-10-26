
const cartRoute = require("./cart.route");
const productRoute = require("./product.route");
const searchRoute = require("./search.route");
const homeRoute = require("./home.route");
const userRoute = require("./user.route");
const checkoutRoute = require("./checkout.route");

const middlewareCart = require("../../middlewares/client/cart.middleware");
const middlewareUser= require("../../middlewares/client/user.middleware");
const middlewareSetting= require("../../middlewares/client/setting.middleware");

module.exports = (app) => {
  app.use(middlewareCart.cartId);
  app.use(middlewareUser.inforUser);
  app.use(middlewareSetting.settingGeneral);


  app.use(`/api/v1/cart`, cartRoute);
  app.use(`/api/v1/products`, productRoute);
  app.use(`/api/v1/search`, searchRoute);
  app.use(`/api/v1`, homeRoute);
  app.use(`/api/v1/user`, userRoute);
  app.use(`/api/v1/checkout`, checkoutRoute);
}