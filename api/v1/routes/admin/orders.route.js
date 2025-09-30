const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/orders.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("orders_view"), controller.index);

router.get("/detail/:id", checkPermission.checkPermission("orders_view"), controller.detail);

router.get("/change-status/:status/:code", checkPermission.checkPermission("orders_edit"), controller.changeStatus);

router.get("/shipping-settings", checkPermission.checkPermission("orders_view"), controller.getShippingSettings);
router.patch("/shipping-settings", checkPermission.checkPermission("orders_view"), controller.updateShippingSettings);

module.exports = router;