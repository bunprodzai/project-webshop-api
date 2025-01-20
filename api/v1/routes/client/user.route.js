const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/user.controller");

const validateRegister = require("../../validates/client/register.validate");
const validateLogin = require("../../validates/client/login.validate");
const validatePassword = require("../../validates/client/forgot-password");

const authMiddleware = require("../../middlewares/client/auth.middleware");


router.post("/register",validateRegister.registerPost ,controller.registerPost);

router.post("/login",validateLogin.loginPost ,controller.loginPost);

router.get("/logout", controller.logoutPost);

router.post("/password/forgot",validatePassword.forgotPasswordPost ,controller.forgotPasswordPost);

router.post("/password/otp/:email",validatePassword.optPasswordPost ,controller.optPasswordPost);

router.post("/password/reset-password",validatePassword.resetPasswordPost , controller.resetPasswordPost);

router.get("/info/:tokenUser" ,controller.info);

router.patch("/info/edit" ,controller.editInfo);

router.patch("/info/reset-password" ,controller.resetPasswordPatch);

module.exports = router;