
const User = require("../../models/users.model");

// [GET] /admin/users
module.exports.index = async (req, res) => {
  const find = {
    deleted: false
  }
  const records = await User.find(find).select("-password -tokenUser");

  res.json({
    code: 200,
    message: "Trang tài khoản người dùng",
    records: records
  });
}

// [GET] /admin/users/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
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
    } else {
      res.json({
        code: 400,
        message: "Không tồn tại user!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Thay đổi trạng thái không thành công!"
    });
  }
}

// [DELETE] /admin/users/delete/:idUser
module.exports.delete = async (req, res) => {
  try {
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
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params!"
    });
  }
}

// [GET] /admin/users/detail/:idUser
module.exports.detail = async (req, res) => {
  try {
    const idUser = req.params.idUser;

    const user = await User.findOne({ _id: idUser }).select("-password -tokenUser");

    res.json({
      code: 200,
      message: "Chi tiết tài khoản",
      user: user
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}
