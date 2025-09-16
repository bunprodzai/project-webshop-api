const Article = require("../../models/articles.model");

module.exports.index = async (req, res) => {
  try {
    
    const articleFeatured = await Article.find({deleted: false, featured: "1"});
    const articles = await Article.find({deleted: false});

    res.json({
      code: 200,
      message: "Trả về kết quả tìm kiếm thành công",
      articleFeatured: articleFeatured,
      data: articles
    });
  } catch (error) {
    res.json({
      code: 400,
      message: {error: error.message}
    });
  }
}

module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const article = await Article.findOne({deleted: false, slug: slug});

    res.json({
      code: 200,
      message: "Trả về kết quả tìm kiếm thành công",
      data: article
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}