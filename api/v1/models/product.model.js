const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: {
    type: Number,
    default: 0
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    default: 0
  },
  thumbnail: String, 
  images: [String], // Mảng chứa nhiều ảnh
  status: String,
  position: Number,
  product_category_id: {
    type: String,
    default: ""
  },
  sizeStock: {
    type: [String], // Mảng chứa các chuỗi định dạng "size-quantity"
    default: []
  },
  featured: String,
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
const Product = mongoose.model('Product', productSchema, "products"); //tasks là tên connection trong database

module.exports = Product; 