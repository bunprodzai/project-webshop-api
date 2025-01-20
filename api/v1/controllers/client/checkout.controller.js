const Cart = require("../../models/carts.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");


// [GET] /order/detail/:orderId
module.exports.detailOrder = async (req, res) => {
  try {
    const code = req.params.code;

    const recordsOrder = await Order.findOne({ code: code }).lean();

    if (recordsOrder.products.length > 0) {
      for (const item of recordsOrder.products) {
        const productId = item.product_id;

        const productInfo = await Product.findOne({ _id: productId, deleted: false, status: "active" }).select("title thumbnail price slug discountPercentage");

        productInfo.priceNew = ((productInfo.price * (100 - productInfo.discountPercentage)) / 100).toFixed(0);
        item.totalPrice = productInfo.priceNew * item.quantity;

        item.productInfo = productInfo;

      }
    }

    recordsOrder.totalPriceProducts = recordsOrder.products.reduce((sum, item) => item.totalPrice + sum, 0);

    res.json({
      code: 200,
      message: `Giỏ hàng`,
      recordsOrder: recordsOrder
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi`
    });
  }
}

module.exports.orderPost = async (req, res) => {
  try {
    const cartId = req.body.cartId;
    const userInfo = req.body.userInfo;
    console.log(req.body);

    const recordCarts = await Cart.findOne({ _id: cartId });
    const products = [];
    const user_id = recordCarts.user_id ? recordCarts.user_id : "";

    if (recordCarts.products.length > 0) {
      for (const product of recordCarts.products) {
        const productInfo = await Product.findOne({ _id: product.product_id, deleted: false, status: "active" }).select("price discountPercentage");
        const objProducts = {
          product_id: product.product_id,
          price: productInfo.price,
          quantity: product.quantity,
          discountPercentage: productInfo.discountPercentage
        }
        products.push(objProducts);
      }

      const orderObj = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products,
        user_id: user_id
      }

      const order = new Order(orderObj);
      await order.save();

      await Cart.updateOne({ _id: cartId }, { products: [] });
      res.json({
        code: 200,
        message: "Đặt hàng thành công",
        codeOrder: order.code,
        products: products
      });
    } else {
      res.json({
        code: 204,
        message: "Không có sản phẩm nào trong giỏ hàng"
      });
      return;
    }
    // res.redirect(`/checkout/success/${order._id}`);
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}

module.exports.success = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const paymentMethod = req.body.paymentMethod;

    const recordOrder = await Order.findOne({ _id: orderId }).lean();

    if (recordOrder) {
      await Order.updateOne({ _id: orderId }, {
        paymentMethod: paymentMethod,
        status: "received"
      });
    } else {
      res.json({
        code: 404,
        message: "Tài nguyên không tồn tại!"
      });
    }

    res.json({
      code: 200,
      message: "Thanh toán thành công, chúng tôi sẽ liên hệ lại với bạn để xác nhận",
      recordOrder: recordOrder
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}