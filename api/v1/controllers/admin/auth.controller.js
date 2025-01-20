const Account = require("../../models/account.model");
const md5 = require("md5");
const Role = require("../../models/roles.model");

// [POST] /api/v1/admin/login
module.exports.loginPost = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
      email: email,
      deleted: false
    });
    if (!user) {
      res.json({
        code: 400,
        message: "Email không tồn tại!"
      });
      return;
    }

    if (md5(password) !== user.password) {
      res.json({
        code: 400,
        message: "Sai mật khẩu!"
      });
      return;
    }

    if (user.status != "active") {
      res.json({
        code: 400,
        message: "Tài khoản đã bị khóa!"
      });
      return;
    }
    const permissions = await Role.findOne({ _id: user.role_id });
    const token = user.token;
    // res.cookie("token", token);
    // res.setHeader("Authorization", `Bearer ${token}`);

    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      token: token,
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      permissions: permissions.permissions
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Đăng nhập thất bại!"
    });
  }
}


// [POST] /api/v1/admin/permissionsPost
module.exports.permissionsPost = async (req, res) => {
  try {
    const token = req.body.token;
    const user = await Account.findOne({ token: token });

    if (user) {
      const permissions = await Role.findOne({ _id: user.role_id });
      res.json({
        code: 200,
        message: "Permissions",
        permissions: permissions.permissions
      });
    } else {
      res.json({
        code: 204,
        message: "Không tìm  thấy Account!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
  // /api/v1/auth/login
  // {
  //   "email": "trucle251@gmail.com",
  //     "password": "251"
  // }
}
// [GET] /api/v1/auth/logout
module.exports.logoutPost = async (req, res) => {
  res.clearCookie("token");
  // res.removeHeader("Authorization");
  res.json({
    code: 200,
    message: "Đăng xuất thành công"
  });
}