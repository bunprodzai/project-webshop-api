module.exports.createPost = async (req, res, next) => {
  if (req.body.fullName == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập tên"
    });
    return;
  }

  if (req.body.email == '') {
    res.json({
      code: 400,
      message: "Vui lòng email"
    });
    return;
  }

  if (req.body.password == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập password"
    });
    return;
  }

  next();
}

module.exports.editPatch = async (req, res, next) => {
  if (req.body.fullName == '') {
    res.json({
      code: 400,
      message: "Vui lòng nhập tên"
    });
    return;
  }

  if (req.body.email == '') {
    res.json({
      code: 400,
      message: "Vui lòng email"
    });
    return;
  }

  next();
}