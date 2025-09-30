const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.category.controller");
const { categoryValidationRules, categoryValid } = require("../../validates/admin/products-category.validate");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("products_category_view"),
  controller.index);

router.post("/create", checkPermission.checkPermission("products_category_create"),
  categoryValidationRules, categoryValid, controller.createPost);

router.patch("/edit/:id", checkPermission.checkPermission("products_category_edit"),
  categoryValidationRules, categoryValid, controller.editPatch);

router.delete("/delete-item/:id", checkPermission.checkPermission("products_category_del"),
  controller.deleteItem);

router.get("/change-status/:status/:id", checkPermission.checkPermission("products_category_edit"),
  controller.changeStatus);

// router.patch("/deletemulti-item", checkPermission, controller.deleteMultiItem);

module.exports = router;