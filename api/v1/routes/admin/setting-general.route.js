const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/settings.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/general", checkPermission.checkPermission("settings_general"), controller.general);
router.patch("/general", checkPermission.checkPermission("settings_general"), controller.generalPatch);

module.exports = router;