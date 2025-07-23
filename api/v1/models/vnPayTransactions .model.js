const mongoose = require("mongoose");

const vnpaySchema = new mongoose.Schema({
  code_TxnRef: String,
  amount: Number,
  orderInfo: String,
  paymentUrl: String,
  status: {
    type: String,
    enum: ['pending', 'paid', 'expired'],
    default: 'pending'
  },
  expireAt: {
    type: Date,
    expires: 86400
  },
  deletedAt: Date
},
  {
    timestamps: true,
  });

const VNPayTransactions = mongoose.model('VNPayTransactions', vnpaySchema, "vnpays"); //roles là tên connection trong database

module.exports = VNPayTransactions; 