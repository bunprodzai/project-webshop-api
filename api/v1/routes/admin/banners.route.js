const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/banners.controller");
const { bannerValid, bannerValidationRules } = require("../../validates/admin/banner.validate");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("banners_view"), controller.index);

router.post("/create", checkPermission.checkPermission("banners_create"),
  bannerValidationRules, bannerValid, controller.createPost);

router.patch("/edit/:id", checkPermission.checkPermission("banners_edit"),
  bannerValidationRules, bannerValid, controller.editPatch);

router.get("/change-status/:status/:id", checkPermission.checkPermission("banners_edit"), controller.changeStatus);

router.delete("/delete/:id", checkPermission.checkPermission("banners_del"), controller.delDelete);


module.exports = router;