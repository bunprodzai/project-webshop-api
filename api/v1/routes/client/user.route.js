const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");
const { registerValidationRules, registerValid } = require("../../validates/client/register.validate");
const { loginValidationRules, loginUserValid } = require("../../validates/client/login.validate");
const { apiLimiter } = require("../../middlewares/apiLimiter.middleware");
const validForgot = require("../../validates/client/forgot-password");

const authMiddleware = require("../../middlewares/client/auth.middleware");

router.post("/register", apiLimiter,
  registerValidationRules, registerValid, controller.registerPost);

router.post("/login", apiLimiter,
  loginValidationRules, loginUserValid, controller.loginPost);

router.post("/password/forgot", apiLimiter,
  validForgot.forgotPasswordPost, controller.forgotPasswordPost);

router.post("/password/otp/:email", apiLimiter,
  validForgot.optPasswordPost, controller.optPasswordPost);

router.post("/password/reset-password", authMiddleware.requireAuth,
  validForgot.resetPasswordPost, controller.resetPasswordPost);

router.get("/info", authMiddleware.requireAuth,
  controller.info);

router.patch("/info/edit", authMiddleware.requireAuth,
  controller.editInfo);

router.patch("/info/reset-password", authMiddleware.requireAuth,
  controller.resetPasswordPatch);

router.get("/history-order", authMiddleware.requireAuth,
  controller.ordersHistoryByUserId);


module.exports = router;