const Product = require("../../models/product.model");

const searchHelper = require("../../../../helpers/search");
const productsHelper = require("../../../../helpers/products");

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

    const newRecords = productsHelper.priceNewProducts(records);

    res.json({
      code: 200,
      message: "Trả về kết quả tìm kiếm thành công",
      keyword: keyword,
      records: newRecords
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }
}