const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");


router.get("/", controller.index);

router.get("/delete/:idProduct", controller.del);

router.get("/update/:idProduct/:quantity", controller.update);

router.patch("/add/:productId", controller.addPost);

module.exports = router;