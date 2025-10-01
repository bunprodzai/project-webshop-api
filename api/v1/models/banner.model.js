
const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: Date,
  image: String,
  status: String,
  position: Number,
  excerpt: String,
  backgroundColor: String,
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
const Banner = mongoose.model('Banner', bannerSchema, "banners"); //tasks là tên connection trong database

module.exports = Banner; 