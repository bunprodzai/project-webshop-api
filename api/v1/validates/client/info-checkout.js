const { body, validationResult } = require("express-validator");


const infoCheckoutValidationRules = [
  body("userInfo.email")
    .notEmpty().withMessage("Email không được để trống!")
    .isEmail().withMessage("Email không hợp lệ!"),

  body("userInfo.fullName")
    .notEmpty().withMessage("Tên không được để trống!")
    .isLength({ max: 40 }).withMessage("Tên không được quá 40 ký tự!")
    .matches(/^[A-Za-zÀ-ỹ0-9\s]+$/u).withMessage("Tên không được chứa ký tự đặc biệt!"),

  body("userInfo.phone")
    .notEmpty().withMessage("Phone không được để trống!")
    .isLength({ min: 10, max: 10 }).withMessage("Phone phải 10 số!")
    .matches(/^[0-9]+$/).withMessage("Phone chỉ chứa số"),

  body("userInfo.address")
    .notEmpty().withMessage("Địa chỉ không được để trống!")
    .isLength({ max: 256 }).withMessage("Địa chỉ phải không được quá 256 ký tự!"),
];

const infoCheckoutValid = async (req, res, next) => {
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
  infoCheckoutValidationRules,
  infoCheckoutValid
}
