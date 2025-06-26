const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller");


router.get("/order/detail/:code", controller.detailOrder);

router.post("/order", controller.orderPost);

router.patch("/success/:orderId", controller.success);
router.get("/history/:tokenUser", controller.ordersHistoryByUserId);

module.exports = router;