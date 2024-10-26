const User = require("../../models/users.model");

module.exports.inforUser = async (req, res, next) => {
  const tokenUser = req.cookies.tokenUser;

  if (tokenUser) {
    const user = await User.findOne({
      tokenUser: tokenUser,
      status: "active",
      deleted: false
    }).select("-password");

    if (user) {
      req.user = user;
    }

  } else {

  }

  next();
}