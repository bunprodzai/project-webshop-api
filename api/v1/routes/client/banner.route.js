const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/banners.controller");

router.get("/", controller.index);

router.get("/detail/:slug", controller.detail);

router.get("/vouchers/:banner_id", controller.vouchers);

module.exports = router;