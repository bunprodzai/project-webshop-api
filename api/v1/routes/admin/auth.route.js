const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/auth.controller");
const { loginValidationRules, loginValid } = require("../../validates/admin/auth.validate");
const { apiLimiter } = require("../../middlewares/apiLimiter.middleware");

router.post("/login", apiLimiter, loginValidationRules, loginValid, controller.loginPost);

module.exports = router; 