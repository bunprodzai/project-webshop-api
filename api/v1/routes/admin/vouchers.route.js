const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/vouchers.controller");
const { voucherValidationRules, voucherValid } = require("../../validates/admin/voucher.validate");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("vouchers_view"), controller.index);

router.post("/create", checkPermission.checkPermission("vouchers_create"),
  voucherValidationRules, voucherValid, controller.createPost);

router.patch("/edit/:id", checkPermission.checkPermission("vouchers_edit"),
  voucherValidationRules, voucherValid, controller.editPatch);

router.get("/change-status/:status/:id", checkPermission.checkPermission("vouchers_edit"), controller.changeStatus);

router.delete("/delete/:id", checkPermission.checkPermission("vouchers_del"), controller.delDelete);


module.exports = router;