const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/orders.controller");


router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.get("/change-status/:status/:code", controller.changeStatus);

module.exports = router;