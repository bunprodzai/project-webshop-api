const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
const { index } = require("../controllers/admin/vouchers.controller");
mongoose.plugin(slug);


const productCategorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  parent_id: {
    type: String,
    default: ""
  },
  status: String,
  position: Number,
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

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema, "products-categorys");

module.exports = ProductCategory; 