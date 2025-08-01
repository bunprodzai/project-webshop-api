const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");

const validateRegister = require("../../validates/client/register.validate");
const validateLogin = require("../../validates/client/login.validate");
const validatePassword = require("../../validates/client/forgot-password");

const authMiddleware = require("../../middlewares/client/auth.middleware");

router.post("/register", validateRegister.registerPost, controller.registerPost);

router.post("/login", validateLogin.loginPost, controller.loginPost);

router.get("/logout", controller.logoutPost);

router.post("/password/forgot", validatePassword.forgotPasswordPost, controller.forgotPasswordPost);

router.post("/password/otp/:email", validatePassword.optPasswordPost, controller.optPasswordPost);

router.post("/password/reset-password", authMiddleware.requireAuth, validatePassword.resetPasswordPost, controller.resetPasswordPost);

router.get("/info", authMiddleware.requireAuth, controller.info);

router.patch("/info/edit", authMiddleware.requireAuth, controller.editInfo);

router.patch("/info/reset-password", authMiddleware.requireAuth, controller.resetPasswordPatch);

router.get("/history-order", authMiddleware.requireAuth, controller.ordersHistoryByUserId);


module.exports = router;