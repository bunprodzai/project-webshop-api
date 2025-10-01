const { body, validationResult } = require("express-validator");

const voucherValidationRules = [
  body("title")
    .notEmpty().withMessage("Tiêu đề không được để trống!")
    .isLength({ max: 80 }).withMessage("Tiêu đề không được nhập quá 80 kí tự!"),
  body("voucher_code")
    .isLength({ max: 14 }).withMessage("Mã voucher không được nhập quá 14 kí tự!")
    .trim()
    .matches(/^[A-Za-z0-9]+$/u).withMessage("Mã voucher không được chứa ký tự đặc biệt, không được có khoản trắng!")
    .notEmpty().withMessage("Mã voucher không được để trống!"),
  body("excerpt")
    .isLength({ max: 200 }).withMessage("Trích đoạn không được nhập quá 200 ký tự!")
    .trim()
    .notEmpty().withMessage("Trích đoạn không được để trống!"),
  body("start_date")
    .notEmpty().withMessage("Ngày bắt đầu không được để trống!"),
  body("end_date")
    .notEmpty().withMessage("Ngày kết thúc không được để trống!"),
  body("banner_id")
    .notEmpty().withMessage("Danh mục quảng cáo không được để trống!"),
  body("quantity")
    .notEmpty().withMessage("Số lượng không được để trống!"),
  body("min_order_value")
    .notEmpty().withMessage("Giá trị đơn hàng tối thiểu nhận không được để trống!"),
  body("discount_value")
    .notEmpty().withMessage("Giá trị giảm giá không được để trống!")
];

const voucherValid = async (req, res, next) => {
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
  voucherValidationRules,
  voucherValid
};