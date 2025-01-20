// file này dùng để tạo hàm render ra giao diện 
const User = require("../../models/users.model");
const md5 = require("md5");


// [GET] /admin/accounts
module.exports.index = async (req, res) => {
  if (req.role.permissions.includes("users_view")) {
    const find = {
      deleted: false
    }
    const records = await User.find(find).select("-password -tokenUser");

    res.json({
      code: 200,
      message: "Trang tài khoản người dùng",
      records: records
    });
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền truy cập"
    });
  }
}

// [PATCH] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    if (req.role.permissions.includes("users_edit")) {
      const status = req.params.status;
      const id = req.params.id;

      const user = await User.findOne({
        _id: id
      });

      if (user) {
        await User.updateOne({
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
        message: "Bạn không có quyền truy cập"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Thay đổi trạng thái không thành công!"
    });
  }
}

// [PATCH] /admin/delete
module.exports.delete = async (req, res) => {
  try {
    if (req.role.permissions.includes("users_del")) {
      const idUser = req.params.idUser;
      const user = await User.findOne({ _id: idUser, deleted: false });

      if (user) {
        await User.updateOne({ _id: idUser }, { deleted: true });

        res.json({
          code: 200,
          message: "Xóa tài khoản thành công"
        });
      } else {
        res.json({
          code: 400,
          message: "Không tồn tại user!"
        });
      }

    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền truy cập"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params!"
    });
  }
}

// [GET] /admin/detail/:idUser
module.exports.detail = async (req, res) => {
  try {
    if (req.role.permissions.includes("users_view")) {
      const idUser = req.params.idUser;

      const user = await User.findOne({ _id: idUser }).select("-password -tokenUser");

      res.json({
        code: 200,
        message: "Chi tiết tài khoản",
        user: user
      });
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền truy cập"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}