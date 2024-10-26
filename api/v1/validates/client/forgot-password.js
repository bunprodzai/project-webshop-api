module.exports.forgotPasswordPost = async (req, res, next) => {

  if (req.body.email == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập email"
    });
    return;
  }
  next();
}

module.exports.resetPasswordPost = async (req, res, next) => {

  if (req.body.password == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu!"
    });
    return;
  }

  if (req.body.comfirmPassword == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập mật khẩu xác nhận!"
    });
    return;
  }


  next();
}

module.exports.optPasswordPost = async (req, res, next) => {

  if (req.body.otp == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập mã OTP"
    });
    return;
  }

  next();
}