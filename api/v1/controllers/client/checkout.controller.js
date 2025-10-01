const Cart = require("../../models/carts.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const ShippingSetting = require("../../models/shippingSetting.model");
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

        const productInfo = await Product.findOne({ _id: productId, deleted: false, status: "active" })
          .select("title thumbnail price slug discountPercentage");

        const priceNew = ((productInfo.price * (100 - productInfo.discountPercentage)) / 100).toFixed(0);
        item.totalPrice = priceNew * item.quantity;
        item.priceNew = priceNew
        item.productInfo = productInfo;
      }
    }

    res.json({
      code: 200,
      message: `Giỏ hàng`,
      data: recordsOrder
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi`
    });
  }
}

// [POST] /checkout/order
// [POST] /checkout/order
module.exports.orderPostGuest = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null; // có thể null
    const userInfo = req.body.userInfo;

    console.log(userId);
    

    let products = [];

    if (userId) {
      // === Khách hàng đã đăng nhập ===
      const recordCarts = await Cart.findOne({ user_id: userId });
      if (!recordCarts || recordCarts.products.length === 0) {
        return res.json({
          code: 400,
          message: "Không tìm thấy sản phẩm trong giỏ hàng!"
        });
      }

      // Map sản phẩm từ giỏ hàng
      for (const product of recordCarts.products) {
        const productInfo = await Product.findOne({
          _id: product.product_id,
          deleted: false,
          status: "active"
        }).select("price discountPercentage");

        if (!productInfo) continue;

        products.push({
          product_id: product.product_id,
          price: productInfo.price,
          quantity: product.quantity,
          discountPercentage: productInfo.discountPercentage,
          size: product.size
        });
      }

      // Sau khi tạo đơn hàng thì clear giỏ hàng
      await Cart.updateOne({ user_id: userId }, { products: [] });

    } else {
      // === Khách vãng lai ===
      const productItems = req.body.productItems; // gửi từ FE
      if (!productItems || productItems.length === 0) {
        return res.json({
          code: 400,
          message: "Không có sản phẩm nào trong đơn hàng!"
        });
      }

      // Map sản phẩm từ req.body
      for (const product of productItems) {
        const productInfo = await Product.findOne({
          _id: product.product_id,
          deleted: false,
          status: "active"
        }).select("price discountPercentage");

        if (!productInfo) continue;

        products.push({
          product_id: product.product_id,
          price: productInfo.price,
          quantity: product.quantity,
          discountPercentage: productInfo.discountPercentage,
          size: product.size
        });
      }
    }

    // Nếu không có sản phẩm hợp lệ
    if (products.length === 0) {
      return res.json({
        code: 204,
        message: "Không có sản phẩm nào hợp lệ để tạo đơn hàng"
      });
    }

    // Tính phí ship
    const shipping = await ShippingSetting.findOne();
    const totalOrder = calculateTotalPrice(products);
    const fee = shipping.freeThreshold < totalOrder ? 0 : shipping.defaultFee;

    // Tạo đơn hàng
    const orderObj = {
      userInfo: userInfo,
      products: products,
      user_id: userId || null, // nếu guest thì null
      totalOrder,
      shippingFee: fee,
      status: "initialize" // trạng thái khởi tạo
    };

    const order = new Order(orderObj);
    await order.save();

    // Gửi email cho admin/shop
    const subject = "Có đơn hàng mới vừa được khởi tạo";
    const html = `
      Mã đơn hàng <b>${order.code}</b><br/>
      Tên khách hàng <b>${order.userInfo.fullName}</b><br/>
      Email khách hàng <b>${order.userInfo.email}</b><br/>
      Số điện thoại khách hàng <b>${order.userInfo.phone}</b>
    `;
    sendMailHelper.sendMail("ttanhoa4455@gmail.com", subject, html);

    return res.json({
      code: 200,
      message: "Đơn hàng đã được tạo, xin vui lòng tiến hành thanh toán",
      codeOrder: order.code
    });

  } catch (error) {
    return res.json({
      code: 400,
      message: "Lỗi: " + error.message
    });
  }
};


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
        paymentMethod: paymentMethod
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
        message: "Đặt đơn thành công, chúng tôi sẽ liên hệ lại với bạn để xác nhận",
      });

    } else {
      res.json({
        code: 404,
        message: "Đơn hàng không tồn tại"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi, " + error.message
    });
  }
}
