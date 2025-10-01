const { body, validationResult } = require("express-validator");

const articleValidationRules = [
  body("title")
    .notEmpty().withMessage("Tiêu đề không được để trống!")
    .trim()
    .isLength({ max: 80 }).withMessage("Tiêu đề không được nhập quá 80 kí tự!"),
  body("category")
    .notEmpty().withMessage("Chọn danh mục!"),
  body("tags")
    .notEmpty().withMessage("Tags không được để trống!"),
  body("author")
    .notEmpty().withMessage("Tác giả không được để trống!")
    .trim()
    .isLength({ max: 40 }).withMessage("Tác giả không được nhập quá 40 kí tự!"),
  body("excerpt")
    .isLength({ max: 200 }).withMessage("Trích đoạn không được nhập quá dài!")
    .trim()
    .notEmpty().withMessage("Trích đoạn không được để trống!"),
  body("description")
    .notEmpty().withMessage("Nội dung không được để trống!")
    .trim()
];

const articleValid = async (req, res, next) => {
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
  articleValidationRules,
  articleValid
};