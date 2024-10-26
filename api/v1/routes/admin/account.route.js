const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/accounts.controller");
const validate = require("../../validates/admin/accounts.validate")

router.get("/", controller.index);

router.post("/create", validate.createPost, controller.createPost);

router.patch("/edit/:id", validate.editPatch, controller.editPatch);

router.patch("/edit/change-status/:status/:id", controller.changeStatus);

router.patch("/delete/:id", controller.delete);

module.exports = router;