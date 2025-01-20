const mongoose = require("mongoose");
const { generateOrd } = require("../../../helpers/generateCodeOrder");


const orderSchema = new mongoose.Schema({
  user_id: String,
  cart_id: String,
  code: {
    type: String,
    default: generateOrd()
  },
  userInfo: {
    fullName: String,
    phone: String,
    address: String,
    note: String
  },
  status: {
    type: String,
    default: "initialize"
  },
  paymentMethod: String,
  products: [
    {
      product_id: String,
      price: Number,
      quantity: Number,
      discountPercentage: Number
    }
  ]
},
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema, "orders");

module.exports = Order; 