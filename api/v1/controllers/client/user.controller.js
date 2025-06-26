const User = require("../../models/users.model");
const Cart = require("../../models/carts.model");
const ForgotPassword = require("../../models/forgot-password.model");

const generateHelper = require("../../../../helpers/generateNumber");
const sendMailHelper = require("../../../../helpers/sendMail");
const md5 = require("md5")

// [POST] /user/register
module.exports.registerPost = async (req, res) => {

  const existEmail = await User.findOne({ email: req.body.email });

  if (existEmail) {
    res.json({
      code: 400,
      message: "Email đã tồn tại!"
    });
    return;
  }

  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  // res.cookie("tokenUser", user.tokenUser);

  res.json({
    code: 200,
    message: "Tạo tài khoản thành công",
    tokenUser: user.tokenUser
  });
}


// [POST] /user/login
module.exports.loginPost = async (req, res) => {

  const user = await User.findOne({ email: req.body.email, deleted: false });

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!"
    });
    return;
  }

  if (md5(req.body.password) != user.password) {
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

  // const existUserCart = await Cart.findOne({ user_id: user.id });

  // let cartId;

  // if (existUserCart) {
  //  cartId =  existUserCart.id;
  // }
  
  res.json({
    code: 200,
    message: "Đăng nhập thành công",
    tokenUser: user.tokenUser,
    fullName: user.fullName,
    avatar: user.avatar,
    // cartId: cartId
  });
}


// [GET] /user/logout
module.exports.logoutPost = async (req, res) => {
  try {
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser, deleted: false });

    delete res.locals.tokenUser;

    res.json({
      code: 200,
      message: `Đăng xuất Email "${user.email}" thành công`,
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Chưa đăng nhập`,
    });
  }
}

// [POST] user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({
    email: email,
    deleted: false,
    status: "active"
  });

  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!"
    });
    return;
  }

  const otp = generateHelper.generateNumber(6);
  const timeExpire = 5;

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now() + timeExpire * 60 * 1000
  }

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // gửi opt qua email user
  const subject = "Mã OTP xách minh mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${otp}</b> (sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẽ mã OTP này với bất kì ai.
  `
  sendMailHelper.sendMail(email, subject, html);

  const expriesCookie = 60 * 10 * 1000; // 10 phut
  res.cookie("emailUser", email, {
    expries: new Date(Date.now() + (expriesCookie * 48))
  });

  res.json({
    code: 200,
    message: `Đã gửi mã otp qua Email: ${email}`,
    email: email
  });
}

// [POST] user/password/optPassword
module.exports.optPasswordPost = async (req, res) => {
  try {
    const email = req.params.email;
    const otp = req.body.otp;

    const user = await User.findOne({
      email: email
    });
    if (!user) {
      res.json({
        code: 400,
        message: "Email không hợp lệ"
      });
      return;
    }

    const result = await ForgotPassword.findOne({
      email: email,
      otp: otp
    });

    if (!result) {
      res.json({
        code: 400,
        message: "OTP không hợp lệ!"
      });
      return;
    }

    // const tokenUser = user.tokenUser;
    // res.cookie("tokenUser", tokenUser); // lưu cookie ở server

    res.json({
      code: 200,
      message: "Xác thực thành công",
      tokenUser: user.tokenUser
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}


// [POST] user/password/reset-password
module.exports.resetPasswordPost = async (req, res) => {
  try {
    const tokenUser = req.body.tokenUser;
    const password = req.body.password;
    const comfirmPassword = req.body.comfirmPassword;

    if (password != comfirmPassword) {
      res.json({
        code: 400,
        message: "Mật khẩu không khớp nhau"
      });
      return;
    }


    const user = await User.findOne({
      tokenUser: tokenUser
    }); // check xem có user có token không



    if (md5(password) == user.password) { // check mật khẩu cũ
      res.json({
        code: 400,
        message: "Mật khẩu mới trùng với mật khẩu cũ"
      });
      return;
    }

    await User.updateOne({
      tokenUser: tokenUser
    }, {
      password: md5(password)
    });

    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}


// [GET] /user/info/:tokenUser
module.exports.info = async (req, res) => {
  try {
    const tokenUser = req.params.tokenUser;

    const user = await User.findOne({ tokenUser: tokenUser }).select("-password -tokenUser");

    res.json({
      code: 200,
      message: "Thông tin cá nhân",
      user: user
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [PATCH] /user/info/:tokenUser
module.exports.editInfo = async (req, res) => {
  try {
    const tokenUser = req.body.tokenUser;
    // delete req.body.tokenUser;

    await User.updateOne({
      tokenUser: tokenUser
    }, req.body);
    res.json({
      code: 200,
      message: "Cập nhật thông tin thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [PATCH] /user/info/:tokenUser
module.exports.resetPasswordPatch = async (req, res) => {
  try {
    const tokenUser = req.body.tokenUser;
    const passwordOld = req.body.passwordOld;
    const passwordNew = req.body.passwordNew;
    const passwordNewComfirm = req.body.passwordNewComfirm;

    const user = await User.findOne({ tokenUser: tokenUser });

    if (!user) {
      res.json({
        code: 400,
        message: "Không tìm thấy user!"
      });
      return;
    }

    if (md5(passwordOld) !== user.password) {
      res.json({
        code: 400,
        message: "Mật khẩu không đúng"
      });
      return;
    }

    if (passwordNew !== passwordNewComfirm) {
      res.json({
        code: 400,
        message: "Mật khẩu không khớp nhau"
      });
      return;
    }

    await User.updateOne({
      tokenUser: tokenUser
    }, {
      password: md5(passwordNew)
    });

    res.json({
      code: 200,
      message: "Cập nhật thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

// [GET] /user/order/list
module.exports.listOrderGet = async (req, res) => {
  try {
    
    res.json({
      code: 200,
      message: "Cập nhật thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}
