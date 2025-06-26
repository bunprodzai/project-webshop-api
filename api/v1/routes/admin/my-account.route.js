const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/my-account.controller");
const validate = require("../../validates/admin/accounts.validate");


router.get("/", controller.index);

router.patch("/edit",
  validate.editPatch,
  controller.editPatch
);
router.patch("/reset-password", controller.resetPassword);
module.exports = router;