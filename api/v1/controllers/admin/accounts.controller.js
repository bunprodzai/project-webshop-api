const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
const md5 = require("md5");


// [GET] /api/v1/accounts
module.exports.index = async (req, res) => {
  try {
    if (req.role.permissions.includes("accounts_view")) {
      const find = {
        deleted: false
      }
      const records = await Account.find(find).select("-password -token");

      for (const record of records) {
        const role = await Role.findOne({ _id: record.role_id, deleted: false });
        record.role = role
      }
      res.json({
        code: 200,
        accounts: records
      });
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền xem danh sách danh sách tài khoản!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
  // /api/v1/accounts
}

// [POST] /api/v1/accounts/create
module.exports.createPost = async (req, res) => {
  if (req.role.permissions.includes("accounts_create")) {
    const exitsEmail = await Account.findOne({
      deleted: false,
      email: req.body.email
    });

    if (exitsEmail) {
      res.json({
        code: 400,
        message: "Email đã tồn tại!"
      });
    } else {
      req.body.password = md5(req.body.password);

      const newAccount = new Account(req.body);
      await newAccount.save();
      res.json({
        code: 200,
        message: "Thêm mới thành công"
      });
    }
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền tạo tài khoản!"
    });
  }
  // /api/v1/accounts/create
  // {
  //   "fullName": "Le Thi Thanh Truc",
  //   "email": "trucle251@gmail.com",
  //   "password": "2501",
  //   "phone": "0799435534",
  //   "role_id": "66cbf2914024ac6286ceb96a",
  //   "status": "active"
  // }
}

// [PATCH] /api/v1/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    if (req.role.permissions.includes("accounts_edit")) {
      const id = req.params.id;
      const exitsEmail = await Account.findOne({
        _id: { $ne: id },
        deleted: false,
        email: req.body.email
      });

      if (exitsEmail) {
        res.json({
          code: 409,
          message: "Email đã tồn tại"
        });
      } else {
        if (req.body.password) {
          req.body.password = md5(req.body.password);
        } else {
          delete req.body.password;
        }
        await Account.updateOne({ _id: id }, req.body);
        res.json({
          code: 200,
          message: "Cập nhập thành công"
        });
      }
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền cập nhập thông tin tài khoản!"
      });
    }

  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhập thất bại!"
    });
  }
  // /api/v1/accounts/edit/66d3d848153ebf5c60dcba0f
  // {
  //   "fullName": "Lê Thị Chanh Chúc",
  //     "phone": "0123456789",
  //       "password": "251"
  // }
}

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    if (req.role.permissions.includes("accounts_edit")) {
      const status = req.params.status;
      const id = req.params.id;

      const account = await Account.findOne({
        _id: id
      });

      if (account) {
        await Account.updateOne({
          _id: id
        }, {
          status: status
        });

        res.json({
          code: 200,
          message: "Thay đổi trạng thái thành công"
        });
      }
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền truy cập!"
      });
    }

  } catch (error) {
    res.json({
      code: 400,
      message: "Thay đổi trạng thái không thành công!"
    });
  }
}

// [PATCH] /admin/accounts/delete/:id
module.exports.delete = async (req, res) => {
  try {
    if (req.role.permissions.includes("accounts_del")) {
      const id = req.params.id;

      const account = await Account.findOne({
        _id: id
      });

      if (account) {
        await Account.updateOne({
          _id: id
        }, {
          deleted: true
        });

        res.json({
          code: 200,
          message: "Xóa thành công"
        });
      }
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền xóa tài khoản!"
      });
    }

  } catch (error) {
    res.json({
      code: 400,
      message: "Xóa không thành công!"
    });
  }
}

