const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");

const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get("/get-cart/:cartId", controller.getCart);

router.patch("/delete/:idProduct", controller.del);

router.patch("/update/:idProduct", controller.update);

router.patch("/add/:productId", controller.addPatch);

router.get("/create", controller.create);

router.patch("/update-user", authMiddleware.requireAuth, controller.updateUser);

router.get("/find", authMiddleware.requireAuth, controller.findCartByUserId);

module.exports = router;