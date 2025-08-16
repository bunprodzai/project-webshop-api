// const Cart = require("../../models/carts.model");
// const User = require("../../models/users.model");

// module.exports.cartId = async (req, res, next) => {
//   const cartId = req.cookies.cartId;
//   console.log(cartId);
  
//   const tokenUser = res.locals.tokenUser
//   console.log(tokenUser);
  
//   try {
//     const existUser = await User.findOne({ tokenUser: tokenUser });

//     if (existUser) {
//       // Nếu có user đã đăng nhập
//       let cart = await Cart.findOne({ _id: cartId });

//       if (cart) {
//         // Cập nhật giỏ hàng với user_id
//         await Cart.updateOne({ _id: cartId }, { user_id: existUser._id });
//         cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
//       } else {
//         // Nếu không tìm thấy giỏ hàng theo cartId
//         cart = new Cart({ user_id: existUser._id, products: [] });
//         await cart.save();

//         const expiresCookie = 60 * 60 * 1000 * 48; // 48 giờ
//         res.cookie("cartId", cart._id.toString(), {
//           expires: new Date(Date.now() + expiresCookie),
//         });

//         req.totalProductsInCart = 0;
//         req.miniCarts = cart;
//       }
//     } else {
//       // Nếu không có user đăng nhập
//       if (!cartId) {
//         // Tạo mới giỏ hàng
//         const cart = new Cart({ products: [] });
//         await cart.save();
//         req.CartId = cart.id;
//       }
//     }
//   } catch (error) {
//     console.error("Error in cartId middleware:", error);
//   }

//   next();
// };

const mongoose = require("mongoose");
const Cart = require("../../models/carts.model");
const User = require("../../models/users.model");

module.exports.cartId = async (req, res, next) => {
  const cartId = req.cookies.cartId;
  const tokenUser = res.locals.tokenUser;

  try {
    const existUser = await User.findOne({ tokenUser: tokenUser });

    if (existUser) {
      // Nếu có user đã đăng nhập
      let cart = null;

      // Chỉ tìm giỏ hàng nếu cartId hợp lệ
      if (cartId && mongoose.Types.ObjectId.isValid(cartId)) {
        cart = await Cart.findById(cartId);
      }

      if (cart) {
        // Cập nhật giỏ hàng với user_id
        await Cart.updateOne({ _id: cart._id }, { user_id: existUser._id });
        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
        req.totalProductsInCart = cart.totalQuantity;
        req.miniCarts = cart;
      } else {
        // Không tìm thấy giỏ hàng → tạo mới
        cart = new Cart({ user_id: existUser._id, products: [] });
        await cart.save();

        const expiresCookie = 1000 * 60 * 60 * 48; // 48 giờ
        res.cookie("cartId", cart._id.toString(), {
          expires: new Date(Date.now() + expiresCookie),
        });

        req.totalProductsInCart = 0;
        req.miniCarts = cart;
      }
    } else {
      // Nếu không có user đăng nhập
      if (!cartId || !mongoose.Types.ObjectId.isValid(cartId)) {
        // Tạo mới giỏ hàng
        const cart = new Cart({ products: [] });
        await cart.save();

        const expiresCookie = 1000 * 60 * 60 * 48; // 48 giờ
        res.cookie("cartId", cart._id.toString(), {
          expires: new Date(Date.now() + expiresCookie),
        });

        req.totalProductsInCart = 0;
        req.miniCarts = cart;
      }
    }
  } catch (error) {
    console.error("Error in cartId middleware:", error);
  }

  next();
};
