const { body, validationResult } = require("express-validator");

// Rule validate cho login
const categoryValidationRules = [
  body("title")
    .notEmpty().withMessage("Tiêu đề không được để trống!")
    .isLength({ max: 60 }).withMessage("Tiêu đề không được nhập quá 60 kí tự!")
    .trim()
    .matches(/^[A-Za-zÀ-ỹ0-9\s]+$/u).withMessage("Tiêu đề không được chứa ký tự đặc biệt!"),
];

const categoryValid = async (req, res, next) => {
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
  categoryValidationRules,
  categoryValid
};