const Article = require("../../models/articles.model");

module.exports.index = async (req, res) => {
  try {
    
    const articleFeatured = await Article({deleted: false, featured: "1"});
    const articles = await Article({deleted: false});

    res.json({
      code: 200,
      message: "Trả về kết quả tìm kiếm thành công",
      articleFeatured: articleFeatured,
      articles: articles
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}