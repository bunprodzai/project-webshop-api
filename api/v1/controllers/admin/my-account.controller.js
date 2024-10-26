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
        code: 400,
        message: "Email đã tồn tại",
      });
      return;
    } else {
      if (req.body.password) {
        req.body.password = md5(req.body.password);
      } else {
        delete req.body.password;
      }
      await Account.updateOne({ _id: id }, req.body);
    }

    const myAccount = await Account.findOne({ _id: id }).select("-password").lean();
    const roles = await Role.find({ deleted: false });
    for (const role of roles) {
      if (role._id == myAccount.role_id) {
        myAccount.titleRole = role.title;
      }
    }
    res.json({
      code: 200,
      message: "Cập nhật thành công",
      myAccount: myAccount
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}