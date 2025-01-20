const User = require("../../models/users.model");

module.exports.inforUser = async (req, res, next) => {
  const tokenUser = res.locals.tokenUser;

  if (tokenUser) {
    const user = await User.findOne({
      tokenUser: tokenUser,
      status: "active",
      deleted: false
    }).select("-password");

    if (user) {
      res.locals.user = user;
    }

  } else {

  }

  next();
}