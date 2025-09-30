const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller");
const { changePasswordValid, changePasswordValidationRules,
  editValid, myAccountEditValidationRules
} = require("../../validates/admin/my-account.validate");
router.get("/", controller.index);

router.patch("/edit",
  myAccountEditValidationRules, editValid, controller.editPatch);

router.patch("/reset-password",
  changePasswordValidationRules, changePasswordValid, controller.resetPassword);

module.exports = router;