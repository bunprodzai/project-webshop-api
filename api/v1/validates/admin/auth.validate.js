const { body, validationResult } = require("express-validator");

// Rule validate cho login
const loginValidationRules = [
  body("email")
    .notEmpty().withMessage("Email không được để trống!")
    .isEmail().withMessage("Email không hợp lệ!"),
  body("password")
    .notEmpty().withMessage("Password không được để trống!")
];

// Middleware xử lý validate
const loginValid = async (req, res, next) => {
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

  // Nếu hợp lệ thì cho đi tiếp
  next();
};

module.exports = {
  loginValidationRules,
  loginValid
};
