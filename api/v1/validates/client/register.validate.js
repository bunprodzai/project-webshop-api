const { body, validationResult } = require("express-validator");

// Rule validate cho login
const registerValidationRules = [
  body("email")
    .notEmpty().withMessage("Email không được để trống.")
    .isEmail().withMessage("Email không hợp lệ."),
  body("fullName")
    .notEmpty().withMessage("Tên không được để trống."),
  body("password")
    .notEmpty().withMessage("Password không được để trống.")
    .isLength({ min: 12 }).withMessage("Password phải ít nhất 12 ký tự."),
];

const registerValid = async (req, res, next) => {
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
  registerValidationRules,
  registerValid
}
