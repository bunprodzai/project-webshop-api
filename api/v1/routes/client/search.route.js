const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/search.controller");
const rateLimit = require("express-rate-limit");
const { searchValidationRules, searchValid } = require("../../validates/client/search.validate");
router.get("/", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { code: 429, message: "Quá nhiều lần truy cập, vui lòng thử lại sau." },
  standardHeaders: true,
  legacyHeaders: false,
}),
  searchValidationRules, searchValid, controller.index);


module.exports = router;