const { getAdvice } = require('../../services/openaiService');
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product.category.model");

module.exports.index = async (req, res) => {
  try {
    const { message } = req.body;

    // Tùy câu hỏi, lấy sản phẩm phù hợp từ DB
    const products = await Product.find({ deleted: false }).
      select("_id title price discountPercentage sizeStock thumbnail product_category_id slug"); // Hoặc tìm theo keyword
    const categories = await ProductCategory.find({ deleted: false }).select("title _id");

    const baseUrl = "http://localhost:3000/detail/";

    const forAI = {
      products: products.map(p => ({
        title: p.title,
        price: p.price,
        discountPercentage: p.discountPercentage,
        sizeStock: p.sizeStock,
        thumbnail: p.thumbnail,
        product_category_id: p.product_category_id,
        link: baseUrl + p.slug
      })),
      categories: categories
    }

    const advice = await getAdvice(message, forAI);

    res.json({ reply: advice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server' });
  }
}