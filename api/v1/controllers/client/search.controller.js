const Product = require("../../models/product.model");
const searchHelper = require("../../../../helpers/search");

module.exports.index = async (req, res) => {
  try {
    const searchData = searchHelper(req.query);

    if (!searchData.keyword) {
      return res.json({
        code: 400,
        message: "Từ khóa không hợp lệ"
      });
    }
    const find = {
      deleted: false,
      status: "active",
      ...searchData.condition
    }
    const records = await Product.find(find).select("-updatedBy -createdAt -updatedAt -createBy").lean();

    res.json({
      code: 200,
      message: "Trả về kết quả tìm kiếm thành công",
      keyword: searchData.keyword,
      data: records
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi ${error.message}`
    });
  }
};
