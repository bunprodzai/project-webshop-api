const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/articles.controller");
const validate = require("../../validates/admin/accounts.validate")
const checkPermission = require("../../middlewares/admin/checkPermission.middleware");


router.get("/", checkPermission.checkPermission("articles_view"), controller.index);

router.post("/create", checkPermission.checkPermission("articles_create"), validate.createPost, controller.createPost);

router.patch("/edit/:id", checkPermission.checkPermission("articles_edit"), validate.editPatch, controller.editPatch);

router.delete("/delete/:id", checkPermission.checkPermission("articles_del"), controller.delete);

router.get("/detail/:id", checkPermission.checkPermission("articles_view"), controller.detail);

module.exports = router;