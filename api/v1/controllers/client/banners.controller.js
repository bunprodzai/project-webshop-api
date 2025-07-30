const Banner = require("../../models/banner.model");


// [GET] /api/v1/banners
module.exports.index = async (req, res) => {
  const banners = await Banner.find({ deleted: false }).sort({ position: 1 });
  res.json({
    code: 200,
    message: "Danh sách quảng cáo",
    banners: banners
  });
}