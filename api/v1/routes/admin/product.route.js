const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");
const validate = require("../../validates/admin/product.validate");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

// đăng nhập vào và gửi token lên thông qua req.headers.authorization mới vào được
router.get("/", checkPermission.checkPermission("products_view"), controller.index);

router.get("/change-status/:status/:id", checkPermission.checkPermission("products_edit"), controller.changeStatus);

router.delete("/delete-item/:id", checkPermission.checkPermission("products_del"), controller.deleteItem);

router.post("/create-item", checkPermission.checkPermission("products_create"), validate.createPost, controller.createItem);

router.patch("/edit-item/:id", checkPermission.checkPermission("products_edit"), controller.editPatch);

router.get("/detail/:id", checkPermission.checkPermission("products_view"), controller.detail);

router.post("/reviews/replies/:reviewId", controller.addReply);

router.delete("/reviews/delete/:reviewId", controller.deleteReview);

router.delete("/reviews/delete/:reviewId/:replyId", controller.deleteReply);

module.exports = router;