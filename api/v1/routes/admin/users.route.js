const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/users.controller");

const validate = require("../../validates/admin/user.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/edit/:idUser", controller.edit);

router.patch("/edit/:idUser",  validate.editPatch ,controller.editPatch);

router.patch("/delete/:idUser", controller.delete);

router.get("/detail/:idUser", controller.detail);

module.exports = router;