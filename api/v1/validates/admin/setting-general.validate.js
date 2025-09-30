const { body, validationResult } = require("express-validator");

// Rule validate cho login
const settingValidationRules = [
  body("websiteName")
    .notEmpty().withMessage("websiteName không được để trống!"),
  body("phone")
    .notEmpty().withMessage("Số điện thoại không được để trống!"),
  body("email")
    .notEmpty().withMessage("Email không được để trống!")
    .isEmail().withMessage("Email không hợp lệ!"),
  body("address")
    .notEmpty().withMessage("Địa chỉ không được để trống!"),
  body("copyright")
    .notEmpty().withMessage("Copyright không được để trống!"),
  body("facebook")
    .notEmpty().withMessage("Facebook không được để trống!"),
  body("instagram")
    .notEmpty().withMessage("Instagram không được để trống!"),
  body("map_url")
    .notEmpty().withMessage("Map không được để trống!"),
  body("shopee")
    .notEmpty().withMessage("Shopee không được để trống!"),
  body("lazada")
    .notEmpty().withMessage("Lazada không được để trống!"),
  body("tiki")
    .notEmpty().withMessage("Tiki không được để trống!")
];

const settingValid = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      code: 400,
      message: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  next();
}

module.exports = {
  settingValidationRules,
  settingValid
};