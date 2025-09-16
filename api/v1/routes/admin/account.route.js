const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller");
const validate = require("../../validates/admin/accounts.validate")
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("accounts_view"), controller.index);

router.post("/create", validate.createPost, checkPermission.checkPermission("accounts_create"), controller.createPost);

router.patch("/edit/:id", validate.editPatch, checkPermission.checkPermission("accounts_edit"), controller.editPatch);

router.get("/change-status/:status/:id", checkPermission.checkPermission("accounts_edit"), controller.changeStatus);

router.delete("/delete/:id", checkPermission.checkPermission("accounts_del"), controller.delete);

module.exports = router;