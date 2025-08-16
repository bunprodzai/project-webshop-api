const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.category.controller");
const validate = require("../../validates/admin/products-category.validate");


router.get("/", controller.index);

router.post("/create", validate.createPost, controller.createPost);

router.patch("/edit/:id", validate.createPost ,controller.editPatch);

router.delete("/delete-item/:id", controller.deleteItem);

router.get("/change-status/:status/:id", controller.changeStatus);

// router.patch("/deletemulti-item", controller.deleteMultiItem);

module.exports = router;