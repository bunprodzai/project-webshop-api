
module.exports.loginPost = async (req, res, next) => {

  if (req.body.email == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập email",
    });
    return;
  }

  if (req.body.password == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập password",
    });
    return;
  }

  next();
}