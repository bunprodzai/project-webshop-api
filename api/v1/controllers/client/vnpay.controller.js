const VNPayTransactions = require("../../models/vnPayTransactions .model.js");
const Order = require("../../models/order.model.js");
const { VNPay, ignoreLogger, ProductCode, VnpLocale, dateFormat } = require('vnpay');
const sendMailHelper = require("../../../../helpers/sendMail");
const Product = require("../../models/product.model.js");
const productHelper = require("../../../../helpers/products");
const { renderProductsTable } = require("../../../../helpers/renderProductsTable");

// [POST] /vn-pay/create-qr
module.exports.createQr = async (req, res) => {

  const { code, Amount, orderInfo } = req.body;

  const existsVNPay = await VNPayTransactions.findOne({ status: "pending", code_TxnRef: code });

  if (existsVNPay) {
    // nếu khách hàng đã tạo trước đó
    res.status(201).json(existsVNPay.paymentUrl);
    return;
  }

  const vnpay = new VNPay({
    tmnCode: process.env.TMNCODE,
    secureSecret: process.env.SECURESECRET,
    vnpayHost: 'https://sanbox.vnpayment.vn',
    testMode: true,
    hashAlgorithm: 'SHA512',
    loggerFn: ignoreLogger
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const vnpayResponse = await vnpay.buildPaymentUrl({
    vnp_Amount: Number(Amount), // tiền
    vnp_IpAddr: '127.0.0.1', //
    vnp_TxnRef: code, // mã đơn hàng
    vnp_OrderInfo: orderInfo, // thông tin đơn hàng.
    vnp_OrderType: ProductCode.Other,
    vnp_ReturnUrl: `https://project-webshop-api.vercel.app/api/v1/vn-pay/check-payment-vnpay`, //
    vnp_Locale: VnpLocale.VN, // 'vn' or 'en'
    vnp_CreateDate: dateFormat(new Date()),
    vnp_ExpireDate: dateFormat(tomorrow), // 1 ngày sau hết hạn
  });

  // Lưu thông tin đơn hàng lại
  await VNPayTransactions.create({
    code_TxnRef: code,
    amount: Number(Amount),
    orderInfo: orderInfo,
    paymentUrl: vnpayResponse
  });

  return res.status(201).json(vnpayResponse)
}

// [GET] /vn-pay/check-payment-vnpay
module.exports.checkPayment = async (req, res) => {
  const code = req.query.vnp_TxnRef;
  const isSuccess = req.query.vnp_ResponseCode === '00';
  const vnp_Amount = req.query.vnp_Amount;

  if (isSuccess) {
    await VNPayTransactions.updateOne({ code_TxnRef: code }, { status: "paid" });

    const orderCurrent = await Order.findOne({ code: code }).select("totalOrder").lean();

    await Order.updateOne({ code: code },
      { status: "received", paymentMethod: "bank", shippingFee: Number(vnp_Amount) / 100 - orderCurrent.totalOrder });


    const order = await Order.findOne({ code: code }).lean();

    await Order.updateOne({ code: code },
      { status: "received", paymentMethod: "bank", shippingFee: Number(vnp_Amount) / 100 - order.totalOrder });

    // gửi opt qua email user
    const subject = "Khách hàng đã xác nhận thanh toán đơn hàng";
    const html = `
          <p>Mã đơn hàng <b>${code}</b></p>
          <p>Tên khách hàng <b>${order.userInfo.fullName}</b></p>
          <p>Phương thức thanh toán <b>Bank</b></p>
        `
    sendMailHelper.sendMail("ttanhoa4455@gmail.com", subject, html);

    // gửi thông tin đơn hàng
    const products = [];
    let totalQuantity = 0;

    if (order.products.length > 0) {
      // tổng số lượng sản phẩm của đơn hàng
      for (const product of order.products) {
        const priceNew = productHelper.priceNew(product);

        totalQuantity += product.quantity;

        const infoProduct = await Product.findOne({ _id: product.product_id, deleted: false, status: "active" }).select("title discountPercentage");

        const objProducts = {
          priceNew: priceNew,
          quantity: product.quantity,
          discountPercentage: infoProduct.discountPercentage,
          size: product.size,
          title: infoProduct.title,
        }
        products.push(objProducts);
      }
    }

    // gửi opt qua email user
    const subject2 = "Đơn hàng của bạn đã được xác nhận, đơn hàng sẽ được giao đến bạn sớm nhất";
    const productsTableHTML = renderProductsTable(products); // `products` là mảng bạn đã có

    const html2 = `
          <p>Cảm ơn bạn đã đặt hàng tại cửa hàng chúng tôi!</p>
          <p><b>Mã đơn hàng:</b> ${order.code}</p>
          <p><b>Tên khách hàng:</b> ${order.userInfo.fullName}</p>
          <p><b>Phương thức thanh toán:</b> ${order.paymentMethod}</p>
          <br/>
          <p><b>Chi tiết đơn hàng:</b></p>
          ${productsTableHTML}
          <br/>
          <p><b>Tổng số lượng sản phẩm</b> ${totalQuantity}</p>
          <p><b>Tổng tiền đơn hàng</b> ${order.totalOrder.toLocaleString()} + ${order.shippingFee.toLocaleString()} đ</p>
          <a href="http://localhost:3000/order/checkout/pay/success/${code}" style={{ textDecoration: "none" }} target="_blank" rel="noopener noreferrer">Xem chi tiết đơn hàng</a>
          <p>Trân trọng,<br/>Cửa hàng XYZ</p>
          `;
    sendMailHelper.sendMail(order.userInfo.email, subject2, html2);

    // Redirect về trang frontend
    return res.redirect(`https://project-webshop-reactjs.vercel.app/order/checkout/pay/success/${code}`);
  } else {
    return res.redirect(`https://project-webshop-reactjs.vercel.app/order/checkout/pay/fail/${code}`);
  }

  //   {
  //   vnp_Amount: '10000000',
  //   vnp_BankCode: 'NCB',
  //   vnp_BankTranNo: 'VNP15085784',
  //   vnp_OrderInfo: 'order_id1',
  //   vnp_PayDate: '20250720000048',
  //   vnp_ResponseCode: '00',
  //   vnp_TmnCode: 'NQES4APX',
  //   vnp_TransactionNo: '15085784',
  //   vnp_TransactionStatus: '00',
  //   vnp_TxnRef: 'ordercode3',
  //   vnp_SecureHash: '5399289604b942b8263ddc37da1c18c81ae4f6090817a3d7bda6a70a3d7fc3752eb87a10c7fbba402fb5120f6c7896c7326d3fda229a60a27877c432e773ec2a'  
  //   }
}