// file này dùng để tạo hàm render ra giao diện 
const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
const md5 = require("md5");

// [GET] /my-account
module.exports.index = async (req, res) => {
  const id = req.userAuth.id;

  const myAccount = await Account.findOne({ _id: id }).lean();
  const roles = await Role.find({ deleted: false });
  for (const role of roles) {
    if (role._id == myAccount.role_id) {
      myAccount.titleRole = role.title;
    }
  }
  res.json({
    code: 200,
    message: "Thông tin cá nhân",
    myAccount: myAccount
  });
}

// [PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.userAuth.id;

    const exitsEmail = await Account.findOne({
      _id: { $ne: id },
      deleted: false,
      email: req.body.email
    });

    if (exitsEmail) {
      res.json({
        code: 401,
        message: "Email đã tồn tại",
      });
      return;
    }

    await Account.updateOne({ _id: id }, req.body);


    res.json({
      code: 200,
      message: "Cập nhật thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [PATCH] /admin/my-account/reset-password
module.exports.resetPassword = async (req, res) => {
  try {
    const id = req.userAuth.id;

    const passwordOld = req.body.passwordOld;
    const passwordNew = req.body.passwordNew;
    const passwordNewComfirm = req.body.passwordNewComfirm;
    
    const account = await Account.findOne({ _id: id });

    if (!account) {
      res.json({
        code: 400,
        message: "Không tìm thấy account!"
      });
      return;
    }

    if (md5(passwordOld) !== account.password) {
      res.json({
        code: 204,
        message: "Mật khẩu không đúng!"
      });
      return;
    }

    if (passwordNew !== passwordNewComfirm) {
      res.json({
        code: 204,
        message: "Mật khẩu mới không khớp nhau!"
      });
      return;
    }

    await Account.updateOne({
      _id: id
    }, {
      password: md5(passwordNew)
    });

    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}
