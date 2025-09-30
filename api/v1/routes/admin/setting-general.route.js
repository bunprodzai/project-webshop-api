const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/settings.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");
const { settingValidationRules, settingValid } = require("../../validates/admin/setting-general.validate");

router.get("/general", checkPermission.checkPermission("settings_general"), controller.general);
router.patch("/general", checkPermission.checkPermission("settings_general"),
  settingValidationRules, settingValid, controller.generalPatch);

module.exports = router;