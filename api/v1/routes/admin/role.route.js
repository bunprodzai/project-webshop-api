const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/roles.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("roles_view"), controller.index);

router.post("/create", checkPermission.checkPermission("roles_create"), controller.createPost);

router.get("/detail/:id", checkPermission.checkPermission("roles_view"), controller.detail);

router.patch("/edit/:id", checkPermission.checkPermission("roles_edit"), controller.editPatch);

router.patch("/permissions", checkPermission.checkPermission("roles_permissions"), controller.permissionsPatch);

router.delete("/delete-item/:id", checkPermission.checkPermission("roles_del"), controller.deleteItem);

module.exports = router;