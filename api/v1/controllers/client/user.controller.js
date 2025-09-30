const User = require("../../models/users.model");
const ForgotPassword = require("../../models/forgot-password.model");
const productHelper = require("../../../../helpers/products");
const generateHelper = require("../../../../helpers/generateNumber");
const sendMailHelper = require("../../../../helpers/sendMail");
const md5 = require("md5")

const jwt = require('jsonwebtoken');
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

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

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    code: 200,
    message: "Tạo tài khoản thành công",
    tokenUser: token
  });
}

module.exports.loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email, deleted: false });

    if (!user) {
      res.json({
        code: 401,
        message: "Email không tồn tại!"
      });
      return;
    }

    if (md5(password) != user.password) {
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

    const token = jwt.sign(
      { id: user._id,
        fullName: user.fullName
       },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.json({
      code: 200,
      message: "Đăng nhập thành công",
      tokenUser: token,
      fullName: user.fullName,
      avatar: user.avatar,
      userId: user._id,
      favorites: user.favorites
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message });
  }
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

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      code: 200,
      message: "Xác thực thành công",
      tokenUser: token
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}


// [POST] user/password/reset-password
// đổi mật khẩu của phần quên mật khẩu
module.exports.resetPasswordPost = async (req, res) => {
  try {
    const userId = req.user.id;
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
      _id: userId
    }); // check xem có user có token không

    if (md5(password) === user.password) { // check mật khẩu cũ
      res.json({
        code: 400,
        message: "Mật khẩu mới trùng với mật khẩu cũ"
      });
      return;
    }

    await User.updateOne({
      _id: userId
    }, {
      password: md5(password)
    });

    res.json({
      code: 200,
      message: "Đổi mật khẩu thành công"
    });
  } catch (error) {
    console.log(error.message);
    
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}

// [GET] /user/info
module.exports.info = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findOne({ _id: userId }).select("-password -tokenUser");

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

// [PATCH] /user/info/edit
module.exports.editInfo = async (req, res) => {
  try {
    const userId = req.user.id;

    await User.updateOne({
      _id: userId
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
    const userId = req.user.id;
    
    const passwordOld = req.body.passwordOld;
    const passwordNew = req.body.passwordNew;
    const passwordNewComfirm = req.body.passwordNewComfirm;

    const user = await User.findOne({ _id: userId });

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
      _id: userId
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

//[GET] /history-order
module.exports.ordersHistoryByUserId = async (req, res) => {
  try {
    const userId = req.user.id;

    const records = await Order.find({ user_id: userId }).lean();

    for (const item of records) {
      if (item.products.length > 0) {
        let totalQuantity = 0;

        for (const product of item.products) {
          const priceNew = productHelper.priceNew(product);
          totalQuantity += product.quantity;
          const infoProduct = await Product.findOne({ _id: product.product_id, deleted: false, status: "active" }).select("title");
          product.title = infoProduct.title;
          product.totalPrice = priceNew * product.quantity;
        }

        item.totalQuantity = totalQuantity;
      }
    }

    res.json({
      code: 200,
      message: "Lịch sử đơn hàng",
      records: records
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}