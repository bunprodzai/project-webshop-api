const mongoose = require("mongoose");

const favoriteProductSchema = new mongoose.Schema(
  {
    user_id: String,
    product_id: String,
  },
  {
    timestamps: true,
  });

const FavoriteProduct = mongoose.model('FavoriteProduct', favoriteProductSchema, "favorite-products");

module.exports = FavoriteProduct;
