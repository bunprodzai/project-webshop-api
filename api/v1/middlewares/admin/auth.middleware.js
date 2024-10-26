const Account = require("../../models/account.model");
const Role = require("../../models/roles.model")

module.exports.requireAuth = async (req, res, next) => {

  const token = req.cookies.token;
  if (!token) {
    res.json({
      code: 400,
      message: "Vui lòng đăng nhập!",
    });
    return;
  } else {
    const user = await Account.findOne({ token: token }).select("-password");

    if (!user) {
      res.json({
        code: 400,
        message: "Vui lòng đăng nhập!!",
      });
      return;
    } else {
      const role = await Role.findOne({ _id: user.role_id }).select("permissions title");

      req.role = role;
      req.userAuth = user;
      next();
    }
  }
  // if (req.headers.authorization) {
  //   console.log(req.headers.authorization);

  //   const token = req.headers.authorization.split(" ")[1];

  //   if (!token) {
  //     res.json({
  //       code: 400,
  //       message: "Vui lòng đăng nhập!",
  //     });
  //     return;
  //   } else {
  //     const user = await Account.findOne({ token: token }).select("-password");

  //     if (!user) {
  //       res.json({
  //         code: 400,
  //         message: "Vui lòng đăng nhập!!",
  //       });
  //       return;
  //     } else {
  //       const role = await Role.findOne({ _id: user.role_id }).select("permissions title");

  //       req.role = role;
  //       req.userAuth = user;
  //       next();
  //     }
  //   }
  // } else {
  //   res.json({
  //     code: 400,
  //     message: "Vui lòng đăng nhập!",
  //   });
  //   return;
  // }
}