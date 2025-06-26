const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");


router.get("/get-cart/:cartId", controller.getCart);

router.patch("/delete/:idProduct", controller.del);

router.patch("/update/:idProduct", controller.update);

router.patch("/add/:productId", controller.addPatch);

router.get("/create", controller.create);

router.patch("/update-user/:tokenUser", controller.updateUser);

router.get("/find/:tokenUser", controller.findCartByUserId);

module.exports = router;