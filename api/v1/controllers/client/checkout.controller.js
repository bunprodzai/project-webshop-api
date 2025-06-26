const Cart = require("../../models/carts.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const User = require("../../models/users.model");
const productHelper = require("../../../../helpers/products");
const sendMailHelper = require("../../../../helpers/sendMail");
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
          discountPercentage: productInfo.discountPercentage,
          size: product.size
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

      // gửi opt qua email user
      const subject = "Có đơn hàng mới vừa được khởi tạo";
      const html = `
          Mã đơn hàng <b>${order.code}</b>
          Tên khách hàng <b>${order.userInfo.fullName}</b>
        `
      sendMailHelper.sendMail("ttanhoa4455@gmail.com", subject, html);

      await Cart.updateOne({ _id: cartId }, { products: [] });
      res.json({
        code: 200,
        message: "Đơn hàng đã được tạo, xin vui lòng tiến hành thanh toán",
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
      message: "Lỗi, vui lòng thử lại"
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
        status: "processing"
      });

      // gửi opt qua email user
      const subject = "Khách hàng đã xác nhận thanh toán đơn hàng";
      const html = `
          <p>Mã đơn hàng <b>${recordOrder.code}</b></p>
          <p>Tên khách hàng <b>${recordOrder.userInfo.fullName}</b></p>
          <p>Phương thức thanh toán <b>${paymentMethod}</b></p>
        `
      sendMailHelper.sendMail("ttanhoa4455@gmail.com", subject, html);
      res.json({
        code: 200,
        message: "Thanh toán thành công, chúng tôi sẽ liên hệ lại với bạn để xác nhận",
        recordOrder: recordOrder
      });

    } else {
      res.json({
        code: 404,
        message: "Tài nguyên không tồn tại!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}

module.exports.ordersHistoryByUserId = async (req, res) => {
  try {
    const tokenUser = req.params.tokenUser;
    const user = await User.findOne({ tokenUser: tokenUser }).lean();

    const records = await Order.find({ user_id: user._id.toString() }).lean();

    for (const item of records) {
      if (item.products.length > 0) {
        let totalPrice = 0; //
        let totalQuantity = 0;

        for (const product of item.products) {
          const priceNew = productHelper.priceNew(product);
          totalPrice += priceNew * product.quantity;
          totalQuantity += product.quantity;
          const infoProduct = await Product.findOne({ _id: product.product_id, deleted: false, status: "active" }).select("title");
          product.title = infoProduct.title;
          product.totalPrice = priceNew * product.quantity;
        }

        item.totalOrder = totalPrice;
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