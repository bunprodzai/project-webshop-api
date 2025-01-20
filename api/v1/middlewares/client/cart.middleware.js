const Cart = require("../../models/carts.model");
const User = require("../../models/users.model");

module.exports.cartId = async (req, res, next) => {
  const cartId = req.cookies.cartId;
  console.log(cartId);
  
  const tokenUser = res.locals.tokenUser
  console.log(tokenUser);
  
  try {
    const existUser = await User.findOne({ tokenUser: tokenUser });

    if (existUser) {
      // Nếu có user đã đăng nhập
      let cart = await Cart.findOne({ _id: cartId });

      if (cart) {
        // Cập nhật giỏ hàng với user_id
        await Cart.updateOne({ _id: cartId }, { user_id: existUser._id });
        cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
      } else {
        // Nếu không tìm thấy giỏ hàng theo cartId
        cart = new Cart({ user_id: existUser._id, products: [] });
        await cart.save();

        const expiresCookie = 60 * 60 * 1000 * 48; // 48 giờ
        res.cookie("cartId", cart._id.toString(), {
          expires: new Date(Date.now() + expiresCookie),
        });

        req.totalProductsInCart = 0;
        req.miniCarts = cart;
      }
    } else {
      // Nếu không có user đăng nhập
      if (!cartId) {
        // Tạo mới giỏ hàng
        const cart = new Cart({ products: [] });
        await cart.save();
        req.CartId = cart.id;
      }
    }
  } catch (error) {
    console.error("Error in cartId middleware:", error);
  }

  next();
};


// const Cart = require("../../models/carts.model");

// module.exports.cartId = async (req, res, next) => {
//   const cartId = req.cookies.cartId;
  
//   if (!cartId) {
//     // Nếu chưa có giỏ hàng thì tạo mới giỏ hàng
//     const cart = new Cart();
//     await cart.save();
//     const expriesCookie = 60 * 60 * 1000; // 1 giờ
//     res.cookie("cartId", cart.id, {
//       expries: new Date(Date.now() + (expriesCookie * 48))
//     });
//     const cartIdd = req.cookies.cartId;
//     console.log(cartIdd);
    
//   } else {
//     try {
//       const cart = await Cart.findOne({ _id: cartId });
//       cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
//       req.totalProductsInCart = cart.products.length;
//       req.miniCarts = cart;
//     } catch (error) {
//       console.log(error);
//     }
//   }
//   next();
// }
