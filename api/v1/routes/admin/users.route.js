const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/users.controller");
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");

router.get("/", checkPermission.checkPermission("users_view"), controller.index);

router.get("/change-status/:status/:id", checkPermission.checkPermission("users_edit"), controller.changeStatus);

router.delete("/delete/:idUser", checkPermission.checkPermission("users_del"), controller.delete);

router.get("/detail/:idUser", checkPermission.checkPermission("users_view"), controller.detail);

module.exports = router;