const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller");
const { myAccountValid, changePasswordValidationRules, myAccountEditValidationRules
} = require("../../validates/admin/my-account.validate");
router.get("/", controller.index);

router.patch("/edit",
  myAccountEditValidationRules ,myAccountValid, controller.editPatch);

router.patch("/reset-password",
  changePasswordValidationRules, myAccountValid, controller.resetPassword);

module.exports = router;