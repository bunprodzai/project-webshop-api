
const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const voucherSchema = new mongoose.Schema({
  title: String,
  excerpt: String,
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: Date,
  image: String,
  status: String,
  voucher_code: String,
  discount_value: Number,
  used_count: {
    type: Number,
    default: 0
  },
  quantity: Number,
  banner_id: String,
  min_order_value: {
    type: Number,
    default: 0
  },
  createBy: {
    user_Id: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  deletedBy: {
    user_Id: String,
    deletedAt: Date
  },
  updatedBy: [
    {
      user_Id: String,
      updatedAt: Date
    }
  ],
  slug: { type: String, slug: "title", unique: true },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedAt: Date
},
  {
    timestamps: true,
  });
const Voucher = mongoose.model('Voucher', voucherSchema, "vouchers"); //tasks là tên connection trong database

module.exports = Voucher; 