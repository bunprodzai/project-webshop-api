const mongoose = require("mongoose");
const { generateOrd } = require("../../../helpers/generateCodeOrder");


const orderSchema = new mongoose.Schema({
  user_id: String,
  cart_id: String,
  voucher_code: String,
  code: {
    type: String,
    unique: true,
    default: () => generateOrd()
  },
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
    // initialize
    // processing
    // received
    // success
    // cancelled
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