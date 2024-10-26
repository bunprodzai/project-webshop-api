const User = require("../../models/users.model");

module.exports.requireAuth = async (req, res, next) => {
  const tokenUser = req.cookies.tokenUser;
  if (!tokenUser) {
    res.json({
      code: 300,
      message: "Chưa login"
    });
    return;
  } else {
    const user = await User.findOne({ tokenUser: tokenUser }).select("-password");
    if (!user) {
      res.json({
        code: 300,
        message: "Chưa login"
      });
      return;
    } else {
      req.user = user;
      next();
    }
  }
}