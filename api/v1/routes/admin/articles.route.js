const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/articles.controller");
const validate = require("../../validates/admin/accounts.validate")

router.get("/", controller.index);

router.post("/create", validate.createPost, controller.createPost);

router.patch("/edit/:id", validate.editPatch, controller.editPatch);

router.delete("/delete/:id", controller.delete);

router.get("/detail/:id", controller.detail);

module.exports = router;