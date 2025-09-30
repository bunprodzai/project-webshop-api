const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/trashs.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/:typeItem", checkPermission.checkPermission("trashs_view"),
  controller.items);
router.get("/restore/:typeItem/:idItem",
  checkPermission.checkPermission("trashs_restore"),
  controller.restoreItem);
router.get("/permanent-delete/:typeItem/:idItem",
  checkPermission.checkPermission("trashs_permanent_del"),
  controller.permanentItem);

module.exports = router;