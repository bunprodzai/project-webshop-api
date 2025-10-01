const { body, validationResult } = require("express-validator");

const bannerValidationRules = [
  body("title")
    .notEmpty().withMessage("Tiêu đề không được để trống!")
    .trim()
    .isLength({ max: 60 }).withMessage("Tiêu đề không được nhập quá 60 kí tự!"),
  body("backgroundColor")
    .notEmpty().withMessage("Màu nền không được để trống!"),
  body("excerpt")
    .isLength({ max: 200 }).withMessage("Trích đoạn không được nhập quá dài!")
    .trim()
    .notEmpty().withMessage("Trích đoạn không được để trống!"),
  body("content")
    .notEmpty().withMessage("Nội dung không được để trống!")
    .trim(),
  body("start_date")
    .notEmpty().withMessage("Ngày bắt đầu không được để trống!"),
  body("end_date")
    .notEmpty().withMessage("Ngày kết thúc không được để trống!")
];

const bannerValid = async (req, res, next) => {
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
  bannerValidationRules,
  bannerValid
};