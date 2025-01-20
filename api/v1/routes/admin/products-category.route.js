const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.category.controller");
const validate = require("../../validates/admin/products-category.validate");


router.get("/", controller.index);

router.post("/create", validate.createPost, controller.createPost);

router.patch("/edit/:id", validate.createPost ,controller.editPacth);

router.delete("/delete-item/:id", controller.deleteItem);

router.patch("/deletemulti-item", controller.deleteMultiItem);

router.get("/change-status/:status/:id", controller.changeStatus);

module.exports = router;