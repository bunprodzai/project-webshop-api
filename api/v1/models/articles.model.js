const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);


const articleSchema = new mongoose.Schema({
  title: String,
  description: String,
  thumbnail: String,
  status: String,
  position: Number,
  featured: String,
  slug: { type: String, slug: "title", unique: true },
  deleted: {
    type: Boolean,
    default: false
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
  deletedAt: Date
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model('Article', articleSchema, "articles"); //products là tên connection trong database

module.exports = Article; 