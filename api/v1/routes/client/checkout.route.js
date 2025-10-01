const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/checkout.controller");
const { infoCheckoutValidationRules, infoCheckoutValid } = require("../../validates/client/info-checkout");
const middlware = require("../../middlewares/client/auth.middleware");
router.get("/order/detail/:code", controller.detailOrder);

router.post("/order-user",
  infoCheckoutValidationRules, infoCheckoutValid,
  middlware.requireAuthOptional, controller.orderPostGuest);

router.post("/check-voucher", controller.checkVoucher);

router.patch("/success/:orderId", controller.success);

module.exports = router;