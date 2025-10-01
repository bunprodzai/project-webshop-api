const { body, validationResult } = require("express-validator");

// Rule validate
const accountCreateValidationRules = [
  body("fullName")
    .notEmpty().withMessage("Tên không được để trống")
    .isLength({ max: 40 }).withMessage("Tên không được quá 40 ký tự!")
    .trim()
    .matches(/^[A-Za-zÀ-ỹ0-9\s]+$/u).withMessage("Tên không được chứa ký tự đặc biệt!"),
  body("email")
    .notEmpty().withMessage("Tên không được để trống")
    .trim()
    .isEmail().withMessage("Email không hợp lệ."),
  body("password")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)
    .withMessage("Password phải 8-20 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!"),
  body("role_id")
    .notEmpty().withMessage("Chọn quyền!"),
  body("phone")
    .optional()
    .isLength({ min: 10, max: 10 }).withMessage("Phone phải 10 số!")
    .matches(/^[0-9]+$/).withMessage("Phone chỉ chứa số")
];

// Rule validate cho login
const accountEditValidationRules = [
  body("fullName")
    .notEmpty().withMessage("Tên không được để trống")
    .isLength({ max: 40 }).withMessage("Tên không được quá 40 ký tự!")
    .trim()
    .matches(/^[A-Za-zÀ-ỹ0-9\s]+$/u).withMessage("Tên không được chứa ký tự đặc biệt!"),
  body("email")
    .notEmpty().withMessage("Tên không được để trống")
    .trim()
    .isEmail().withMessage("Email không hợp lệ."),
  body("password")
    .optional()
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/)
    .withMessage("Password phải 8-20 ký tự, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt!"),
  body("role_id")
    .notEmpty().withMessage("Chọn quyền!"),
  body("phone")
    .optional()
    .isLength({ min: 10, max: 10 }).withMessage("Phone phải 10 số!")
    .matches(/^[0-9]+$/).withMessage("Phone chỉ chứa số")
];

const accountValid = async (req, res, next) => {
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
  accountCreateValidationRules,
  accountEditValidationRules,
  accountValid
};