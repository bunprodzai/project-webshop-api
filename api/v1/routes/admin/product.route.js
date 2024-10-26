const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller");
// const authAdminMiddleware = require("../middlewares/authAdmin.middleware");
const validate = require("../../validates/admin/product.validate");
// đăng nhập vào và gửi token lên thông qua req.headers.authorization mới vào được
router.get("/", controller.index);

router.get("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete-item/:id", controller.deleteItem);
router.delete("/deletemulti-item", controller.deleteMultiItem);

router.post("/create-item", validate.createPost, controller.createItem);

router.patch("/edit-item/:id", controller.editPatch);

router.get("/detail/:id", controller.detail);


module.exports = router;