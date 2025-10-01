const mongoose = require("mongoose");
const { generateOrd } = require("../../../helpers/generateCodeOrder");


const orderSchema = new mongoose.Schema({
  user_id: String,
  voucher_code: String,
  code: {
    type: String,
    unique: true,
    default: () => generateOrd()
  },
  shippingFee: Number,
  userInfo: {
    fullName: String,
    phone: String,
    address: String,
    note: String,
    email: String
  },
  status: {
    type: String,
    default: "initialize"
    // initialize -> đơn hàng vừa đc khách tạo
    // received -> đã nhận tiền -> đối với bank
    // confirmed -> đã xác nhận đơn hàng
    // processing -> đang xử lý, chuẩn bị giao
    // shipping -> đơn đã bàn giao cho đơn vị giao
    // completed -> khách đã nhận hàng thành công
    // cancelled -> Hủy do khách hoặc shop
    // returned -> hoàn tiền
  },
  paymentMethod: String,
  products: [
    {
      product_id: String,
      price: Number,
      quantity: Number,
      discountPercentage: Number,
      size: String
    }
  ],
  totalOrder: Number
},
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema, "orders");

module.exports = Order; 