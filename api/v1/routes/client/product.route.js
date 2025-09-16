const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/products.controller");

const authMiddleware = require("../../middlewares/client/auth.middleware");

router.get("/", controller.index);

router.get("/:slugCategory", controller.category);

router.get("/detail/:slug", controller.detail);

router.post("/reviews/create/:productId", authMiddleware.requireAuth, controller.postReview);

router.get("/reviews/:productId", controller.getReviews);

router.post("/reviews/replies/:reviewId", authMiddleware.requireAuth, controller.addReply);

router.delete("/reviews/delete/:reviewId", authMiddleware.requireAuth, controller.deleteReview);

router.delete("/reviews/delete/:reviewId/:replyId", authMiddleware.requireAuth, controller.deleteReply);

module.exports = router;