const { getAdvice } = require('../../services/openaiService');
const Product = require("../../models/product.model");

module.exports.index = async (req, res) => {
  try {
    const { message } = req.body;


    // Tùy câu hỏi, lấy sản phẩm phù hợp từ DB
    const products = await Product.find({ deleted: false }); // Hoặc tìm theo keyword


    const baseUrl = "http://localhost:3000/detail/";

    const productsForAI = products.map(p => ({
      title: p.title,
      price: p.price,
      discountPercentage: p.discountPercentage,
      sizes: p.sizes,
      thumbnail: p.thumbnail,
      link: baseUrl + p.slug
    }));

    const advice = await getAdvice(message, productsForAI);

    res.json({ reply: advice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server' });
  }
}