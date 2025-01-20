const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/users.controller");

const validate = require("../../validates/admin/user.validate");

router.get("/", controller.index);

router.get("/change-status/:status/:id", controller.changeStatus);

router.delete("/delete/:idUser", controller.delete);

router.get("/detail/:idUser", controller.detail);

module.exports = router;