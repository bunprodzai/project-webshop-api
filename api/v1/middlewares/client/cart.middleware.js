const Cart = require("../../models/carts.model");

module.exports.cartId = async (req, res, next) => {
  const cartId = req.cookies.cartId;
  
  if (!cartId) {
    // Nếu chưa có giỏ hàng thì tạo mới giỏ hàng
    const cart = new Cart();
    await cart.save();
    const expriesCookie = 60 * 60 * 1000; // 1 giờ
    res.cookie("cartId", cart.id, {
      expries: new Date(Date.now() + (expriesCookie * 48))
    });
  } else {
    try {
      const cart = await Cart.findOne({ _id: cartId });
      cart.totalQuantity = cart.products.reduce((sum, item) => sum + item.quantity, 0);
      req.totalProductsInCart = cart.products.length;
      req.miniCarts = cart;
    } catch (error) {
      console.log(error);
    }
  }
  next();
}