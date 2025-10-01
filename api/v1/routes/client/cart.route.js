const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/cart.controller");

const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get("/get-cart", authMiddleware.requireAuth, controller.getCart);

router.patch("/add/:productId", authMiddleware.requireAuth, controller.addPatch);

router.patch("/update/:idProduct", authMiddleware.requireAuth, controller.updatePatch);

router.patch("/delete/:idProduct", authMiddleware.requireAuth, controller.delPatch);

router.patch("/merge-cart", authMiddleware.requireAuth, controller.mergeCartPatch);

module.exports = router;