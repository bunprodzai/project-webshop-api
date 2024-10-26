const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/settings.controller");


router.get("/general", controller.general);
router.patch("/general", controller.generalPatch);

module.exports = router;