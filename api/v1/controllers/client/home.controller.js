const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product.category.model");
const productsHelper = require("../../../../helpers/products");


module.exports.home = async (req, res) => {

  const products = await Product.find({
    deleted: false,
    status: "active",
    featured: "1"
  }).select("-updatedBy -createdAt -updatedAt -createBy").lean();

  const productCategory = await ProductCategory.find({
    deleted: false,
    status: "active",
  });

  const newFeaturedProducts = productsHelper.priceNewProducts(products);

  const productsNew = productsHelper.priceNewProducts(await Product.find({
    deleted: false,
    status: "active",
  }).sort({ position: "desc" }).limit(6));

  res.json({
    code: 200,
    message: "Trang chủ",
    newFeaturedProducts: newFeaturedProducts,
    productsNew: productsNew,
    productCategory: productCategory
  });
}