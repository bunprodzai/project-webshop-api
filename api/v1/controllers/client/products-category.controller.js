const ProductCategory = require("../../models/product.category.model");

const productsHelper = require("../../../../helpers/products");

// [GET] /products-category
module.exports.index = async (req, res) => {

  const productsCategory = await ProductCategory.find({
    deleted: false,
    status: "active"
  }).lean().select("-updatedAt -createdAt -description -status -position -deleted -__v");

  res.json({
    code: 200,
    message: "Danh sách danh mục",
    productsCategory: productsCategory
  });
}