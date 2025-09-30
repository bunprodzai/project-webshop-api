const { getAdvice } = require('../../services/openaiService');
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product.category.model");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

let qaSamples = [];

// Load file CSV khi server start
const csvPath = path.join(__dirname, "../../data/a_sample.csv");
fs.createReadStream(csvPath)
  .pipe(csv())
  .on("data", (row) => {
    qaSamples.push(row);
  })
  .on("end", () => {
    console.log("Loaded QA samples:", qaSamples.length);
  });

module.exports.index = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Check nếu câu hỏi match với QA mẫu trong CSV
    const foundQA = qaSamples.find(qa =>
      message.toLowerCase().includes(qa.question.toLowerCase())
    );
    if (foundQA) {
      return res.json({ reply: foundQA.answer });
    }

    // 2. Tìm sản phẩm liên quan từ DB
    const regex = new RegExp(message, "i");
    const products = await Product.find({ 
      deleted: false,
      status: "active"
    }).select("_id title price discountPercentage sizeStock thumbnail product_category_id slug");
    console.log(products);
    
    const categories = await ProductCategory.find({ deleted: false }).select("title _id");
    console.log(categories);
    
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
    };

    // 3. Prompt rõ ràng cho AI
    const prompt = `
Bạn là nhân viên tư vấn bán hàng online cho shop.
Dữ liệu sản phẩm liên quan: ${JSON.stringify(forAI, null, 2)}
Câu hỏi khách: "${message}"

Yêu cầu:
- Trả lời tự nhiên, thân thiện (giống như tư vấn thật).
- Nếu có sản phẩm phù hợp, hãy đưa giá, giảm giá, size còn hàng, và thêm link chi tiết.
- Nếu không tìm thấy sản phẩm, hãy gợi ý danh mục hoặc khuyên khách tham khảo thêm.
- Tránh trả lời chung chung, hãy cụ thể dựa trên dữ liệu.
- Trả về dữ liệu làm cho cho FE (Reactjs) render ra cho đẹp, như hình ảnh, link, ...
`;

    const advice = await getAdvice(prompt);

    res.json({ reply: advice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server' });
  }
};
