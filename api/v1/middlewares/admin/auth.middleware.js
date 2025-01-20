const Account = require("../../models/account.model");
const Role = require("../../models/roles.model")

module.exports.requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).json({
      code: 400,
      message: "Chưa gửi token!",
    });
  }

  const token = authHeader.split(" ")[1]; // Lấy token sau "Bearer "
  if (!token) {
    res.json({
      code: 400,
      message: "Token không hợp lệ!",
    });
    return;
  }

  try {
    
    const user = await Account.findOne({ token: token }).select("-password");

    if (!user) {
      res.json({
        code: 400,
        message: "Token sai!",
      });
      return;
    }

    const role = await Role.findOne({ _id: user.role_id }).select("permissions title");

    req.role = role;
    req.userAuth = user;

    next();
  } catch (error) {
    res.json({
      code: 500,
      message: "Lỗi server!",
    });
    return;
  }
};
