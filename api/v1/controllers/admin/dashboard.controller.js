// file này dùng để tạo hàm render ra giao diện 
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product.category.model");
const Account = require("../../models/account.model");
const User = require("../../models/users.model");

module.exports.dashboard = async (req, res) => {

  const statictic = {
    categoryProduct: {
      total: await ProductCategory.countDocuments({ deleted: false }),
      active: await ProductCategory.countDocuments({ deleted: false, status: "active" }),
      inactive: await ProductCategory.countDocuments({ deleted: false, status: "inactive" })
    },
    product: {
      total: (await Product.countDocuments({ deleted: false })).length,
      active: await Product.countDocuments({ deleted: false, status: "active" }),
      inactive: await Product.countDocuments({ deleted: false, status: "inactive" })
    },
    account: {
      total: (await Account.countDocuments({ deleted: false })).length,
      active: await Account.countDocuments({ deleted: false, status: "active" }),
      inactive: await Account.countDocuments({ deleted: false, status: "inactive" })
    },
    user: {
      total: await User.countDocuments({ deleted: false }),
      active: await User.countDocuments({ deleted: false, status: "active" }),
      inactive: await User.countDocuments({ deleted: false, status: "inactive" })
    }
  }


  res.json({
    code: 200,
    message: "Trang dashboard",
    statictic: statictic
  });
}