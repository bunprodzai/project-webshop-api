const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller");
const { accountEditValidationRules, accountCreateValidationRules, accountValid } = require("../../validates/admin/accounts.validate");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("accounts_view"), controller.index);

router.post("/create", accountCreateValidationRules, accountValid, checkPermission.checkPermission("accounts_create"), controller.createPost);

router.patch("/edit/:id", accountEditValidationRules, accountValid, checkPermission.checkPermission("accounts_edit"), controller.editPatch);

router.get("/change-status/:status/:id", checkPermission.checkPermission("accounts_edit"), controller.changeStatus);

router.delete("/delete/:id", checkPermission.checkPermission("accounts_del"), controller.delete);

module.exports = router;