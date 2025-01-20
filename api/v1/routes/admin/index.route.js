// file chứa tất cả các route khi chúng ta gọi đến thì sẽ chạy vào
// const authMiddleware = require("../middlewares/auth.middleware");
const productRoute = require("./product.route");
const productCategoryRoute = require("./products-category.route");
const roleRoute = require("./role.route");
const accountRoute = require("./account.route");
const authRoute = require("./auth.route");
const darhBoardRoute = require("./dashboard.route");
const myAccountRoute = require("./my-account.route");
const settingRoute = require("./setting-general.route");
const userRoute = require("./users.route");
const orderRoute = require("./orders.route");
const articleRoute = require("./articles.route");


const authMiddleware = require("../../middlewares/admin/auth.middleware");

module.exports = (app) => {
  const prefixAdmin = "admin";
  app.use(`/api/v1/${prefixAdmin}/products`, authMiddleware.requireAuth, productRoute);

  app.use(`/api/v1/${prefixAdmin}/products-category`, authMiddleware.requireAuth, productCategoryRoute);
  
  app.use(`/api/v1/${prefixAdmin}/auth`, authRoute);

  app.use(`/api/v1/${prefixAdmin}/roles`, authMiddleware.requireAuth, roleRoute);

  app.use(`/api/v1/${prefixAdmin}/accounts`, authMiddleware.requireAuth, accountRoute);
  
  app.use(`/api/v1/${prefixAdmin}/dashboard`, authMiddleware.requireAuth, darhBoardRoute);

  app.use(`/api/v1/${prefixAdmin}/my-account`, authMiddleware.requireAuth, myAccountRoute);

  app.use(`/api/v1/${prefixAdmin}/settings`, authMiddleware.requireAuth, settingRoute);

  app.use(`/api/v1/${prefixAdmin}/users`, authMiddleware.requireAuth, userRoute);
  
  app.use(`/api/v1/${prefixAdmin}/orders`, authMiddleware.requireAuth, orderRoute);
  
  app.use(`/api/v1/${prefixAdmin}/articles`, authMiddleware.requireAuth, articleRoute);
} 