const Banner = require("../../models/banner.model");
const Voucher = require("../../models/voucher.model");
const { param } = require("../../routes/admin/banners.route");


// [GET] /api/v1/banners
module.exports.index = async (req, res) => {
  const banners = await Banner.find({ deleted: false }).sort({ position: 1 });
  res.json({
    code: 200,
    message: "Danh sách quảng cáo",
    banners: banners
  });
}

// [GET] /api/v1/banners/detail
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;
  console.log(slug);
  
  const banner = await Banner.findOne({ deleted: false, slug: slug });
  
  res.json({
    code: 200,
    message: "Chi tiết quảng cáo",
    banner: banner
  });
}

// [GET] /api/v1/banners/detail
module.exports.vouchers = async (req, res) => {
  const banner_id = req.params.banner_id;

  const vouchers = await Voucher.find({ deleted: false, banner_id: banner_id, status: "active" });

  res.json({
    code: 200,
    message: "Danh sách voucher theo quảng cáo",
    vouchers: vouchers
  });
}