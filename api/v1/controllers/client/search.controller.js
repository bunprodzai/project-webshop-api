const Product = require("../../models/product.model");

const searchHelper = require("../../../../helpers/search");

module.exports.index = async (req, res) => {
  try {
    const keyword = req.query.keyword;
    
    let find = {
      deleted: false,
      status: "active"
    }

    if (keyword) {
      const objSearch = searchHelper(req.query);
      if (objSearch.regex) {
        find.title = objSearch.regex;
      }
    }

    const records = await Product.find(find).select("-updatedBy -createdAt -updatedAt -createBy").lean();

    res.json({
      code: 200,
      message: "Trả về kết quả tìm kiếm thành công",
      keyword: keyword,
      records: records
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}