const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/dashboard.controller");

router.get("/", controller.dashboard);
router.get("/timestart", controller.timeStart);
router.get("/product/percentGrowth/:time", controller.productGrowth);
router.get("/order/percentGrowth/:time", controller.orderGrowth);
router.get("/user/percentGrowth/:time", controller.userGrowth);
router.get("/category/percentGrowth/:time", controller.categoryGrowth);
router.get("/latest-revenue", controller.latestRevenue);
router.get("/recent-orders", controller.recentOrders);
router.get("/top-selling-category/:time", controller.getTopSellingCategories);

router.get("/top-selling-product/:time", controller.getTopSellingProducts);
router.get("/low-stock-products", controller.getLowStockProducts);

module.exports = router;