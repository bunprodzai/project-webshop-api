const { body, validationResult } = require("express-validator");

// Rule validate cho login
const registerValidationRules = [
  body("email")
    .notEmpty().withMessage("Email không được để trống.")
    .isEmail().withMessage("Email không hợp lệ."),
  body("fullName")
    .notEmpty().withMessage("Tên không được để trống.")
    .isLength({ max: 50 }).withMessage("Tên không được quá 50 ký tự!")
    .matches(/^[A-Za-zÀ-ỹ0-9\s]+$/u).withMessage("Tên không được chứa ký tự đặc biệt!"),
  body("password")
    .notEmpty().withMessage("Password không được để trống.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)
    .withMessage("Password phải 8-20 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!")
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
