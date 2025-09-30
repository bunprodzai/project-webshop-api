const { body, validationResult } = require("express-validator");

// Rule validate cho login
const myAccountEditValidationRules = [
  body("fullName")
    .notEmpty().withMessage("Tên không được để trống"),
  body("email")
    .notEmpty().withMessage("Tên không được để trống")
    .isEmail().withMessage("Email không hợp lệ."),
  body("password")
    .notEmpty().withMessage("Password không được để trống.")
    .isLength({ min: 10 }).withMessage("Password phải ít nhất 10 ký tự."),
];
// Rule validate cho login
const changePasswordValidationRules = [
  body("passwordOld")
    .notEmpty().withMessage("Mật khẩu cũ không được để trống"),
  body("passwordNew")
    .notEmpty().withMessage("Mật khẩu mới không được để trống")
    .isLength({ min: 10 }).withMessage("Mật khẩu phải ít nhất 10 ký tự."),
  body("passwordNewComfirm").optional()
    .notEmpty().withMessage("Mật khẩu xác nhận không được để trống.")
    .isLength({ min: 10 }).withMessage("Mật khẩu phải ít nhất 10 ký tự."),
];

const editValid = async (req, res, next) => {
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

const changePasswordValid = async (req, res, next) => {
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
  myAccountEditValidationRules,
  changePasswordValidationRules,
  editValid,
  changePasswordValid
};