const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/vnpay.controller");


router.post("/create-qr" ,controller.createQr);
router.get("/check-payment-vnpay" ,controller.checkPayment);

module.exports = router;