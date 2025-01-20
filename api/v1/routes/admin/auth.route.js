const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controller");
const validate = require("../../validates/admin/auth.validate");



router.post("/login", validate.loginPost, controller.loginPost);

router.post("/permissions", controller.permissionsPost);

router.get("/logout", controller.logoutPost);

module.exports = router; 