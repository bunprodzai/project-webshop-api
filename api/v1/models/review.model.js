const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema(
//   {
//     userId: String,
//     reviewerName: String,
//     product_id: String,
//     content: String,
//     rating: Number,
//     deleted: {
//       type: Boolean,
//       default: false
//     },
//     deletedAt: Date
//   },
//   {
//     timestamps: true,
//   });
// const Review = mongoose.model('Review', reviewSchema, "reviews");


const replySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // không required => cho phép null
  content: { type: String, required: true, trim: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  createdAt: { type: Date, default: Date.now }
});

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  content: { type: String, required: true, trim: true },
  replies: [replySchema],
  deleted: { type: Boolean, default: false }
}, {
  timestamps: true // tự tạo createdAt, updatedAt
});

const Review = mongoose.model('Review', reviewSchema, "reviews");

module.exports = Review;