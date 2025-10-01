const { body, validationResult } = require("express-validator");

// Rule validate cho login
const productValidationRules = [
  body("title")
    .notEmpty().withMessage("Tiêu đề không được để trống!")
    .trim()
    .isLength({ max: 80 }).withMessage("Tiêu đề không được nhập quá 80 kí tự!"),
  body("product_category_id")
    .notEmpty().withMessage("Chọn danh mục!"),
  body("price")
    .notEmpty().withMessage("Giá không được để trống!")
    .isNumeric().withMessage("Giá chỉ được chứa số!"),
  body("discountPercentage")
    .isNumeric().withMessage("Phần trăm giảm giá chỉ được chứa số!"),
  body("sizeStock")
    .notEmpty().withMessage("Kích cở và số lượng không được để trống!")
];

const productValid = async (req, res, next) => {
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
  productValidationRules,
  productValid
};