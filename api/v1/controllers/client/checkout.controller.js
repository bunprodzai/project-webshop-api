const Cart = require("../../models/carts.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const sendMailHelper = require("../../../../helpers/sendMail");
const Voucher = require("../../models/voucher.model");
const { calculateTotalPrice } = require("../../../../helpers/calculateTotal");


// [GET] /order/detail/:orderId
module.exports.detailOrder = async (req, res) => {
  try {
    const code = req.params.code;

    const recordsOrder = await Order.findOne({ code: code }).lean();

    if (recordsOrder.products.length > 0) {
      for (const item of recordsOrder.products) {
        const productId = item.product_id;

        const productInfo = await Product.findOne({ _id: productId, deleted: false, status: "active" }).select("title thumbnail price slug discountPercentage");

        const priceNew = ((productInfo.price * (100 - productInfo.discountPercentage)) / 100).toFixed(0);

        item.totalPrice = priceNew * item.quantity;
        item.priceNew = priceNew
        item.productInfo = productInfo;

      }
    }

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
        const productInfo = await Product.findOne({ _id: product.product_id, deleted: false, status: "active" })
          .select("price discountPercentage");

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
        user_id: user_id,
        totalOrder: calculateTotalPrice(products)
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


module.exports.checkVoucher = async (req, res) => {
  try {
    const order_code = req.body.order_code;
    const voucher_code = req.body.voucher_code;

    const order = await Order.findOne({ code: order_code });

    if (!order) {
      res.json({
        code: 204,
        message: "Không tìm thấy đơn hàng này!"
      });
      return;
    }

    const voucher = await Voucher.findOne({ voucher_code: voucher_code, status: "active", deleted: false });

    if (!voucher) {
      res.json({
        code: 204,
        message: "Mã voucher không đúng!"
      });
      return;
    }

    if (voucher.voucher_code === order.voucher_code) {
      res.json({
        code: 204,
        message: "Voucher này đã được áp dụng cho đơn hàng của bạn!"
      });
      return;
    }

    const dayNow = Date.now();

    if (dayNow > new Date(voucher.end_date).getTime()) {
      res.json({
        code: 204,
        message: "Voucher đã hết hạn!"
      });
      return;
    }

    if (dayNow < new Date(voucher.start_date).getTime()) {
      res.json({
        code: 204,
        message: "Voucher chưa được kích hoạt!"
      });
      return;
    }

    if (voucher.quantity === voucher.used_count) {
      res.json({
        code: 204,
        message: "Số lượng voucher đã hết!"
      });
      return;
    }

    if (order.totalOrder < voucher.min_order_value) {
      res.json({
        code: 204,
        message: "Đơn hàng không đủ điều kiện để nhận voucher!"
      });
      return;
    }

    let newTotalOrder;

    if (voucher.discount_value < 100) {
      newTotalOrder = order.totalOrder - ((order.totalOrder * voucher.discount_value) / 100);
    } else {
      newTotalOrder = order.totalOrder - voucher.discount_value;
    }

    await Voucher.updateOne({ voucher_code: voucher_code }, { used_count: voucher.used_count + 1 });
    await Order.updateOne({ code: order_code }, { voucher_code: voucher_code, totalOrder: newTotalOrder });

    res.json({
      code: 200,
      message: "Voucher đã được áp dụng thành công!"
    });

    // res.redirect(`/checkout/success/${order._id}`);
  } catch (error) {
    console.log(error.message);
    
    res.json({
      code: 400,
      message: "Lỗi, vui lòng thử lại"
    });
  }
}

module.exports.success = async (req, res) => {
  try {
    // chỉ dành cho thanh toán bằng cod
    const orderId = req.params.orderId;
    const paymentMethod = req.body.paymentMethod;

    const recordOrder = await Order.findOne({ _id: orderId }).lean();

    if (recordOrder) {
      await Order.updateOne({ _id: orderId }, {
        paymentMethod: paymentMethod,
        status: "processing"
      });

      // gửi opt qua email user
      const subject = "Khách hàng đã xác nhận đặt hàng";
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
