const { query, validationResult } = require("express-validator");

// Rule validate cho login
const searchValidationRules = [
  query("keyword")
    .notEmpty().withMessage("Từ khóa tìm kiếm không được để trống.")
    .isLength({ max: 300 }).withMessage("Từ khóa tìm kiếm không vượt quá 300 ký tự!")
];

const searchValid = async (req, res, next) => {
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
  searchValidationRules,
  searchValid
}
