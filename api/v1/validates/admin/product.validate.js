module.exports.createPost = async (req, res, next) => {
  if (req.body.title == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập tiêu đề!"
    });
    return;
  }

  next();
}