const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product.category.model");
const User = require("../../models/users.model");
const Article = require("../../models/articles.model");
const Account = require("../../models/account.model");
const Banner = require("../../models/banner.model");
const Voucher = require("../../models/voucher.model");
const panigationHelper = require("../../../../helpers/pagination");
const searchHelper = require("../../../../helpers/search");


// [GET] /trashs/:typeItem
module.exports.items = async (req, res) => {
  try {
    const limitItem = req.query.limit;
    let find = {
      deleted: true
    };

    // phân trang 
    let initPagination = {
      currentPage: 1,
      limitItems: limitItem
    };

    // Tìm kiếm
    const searchData = searchHelper(req.query);

    if (searchData.keyword) {
      find = { ...find, ...searchData.condition };
    }
    // end Tìm kiếm

    const typeItem = req.params.typeItem
    let data;
    let totalPage;
    switch (typeItem) {
      case "products":
        {
          const count = await Product.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const products = await Product.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id");
          totalPage = objetPagination.totalPage
          data = products;
        }
        break;

      case "categories":
        {
          const count = await ProductCategory.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const categories = await ProductCategory.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id");
          totalPage = objetPagination.totalPage
          data = categories;
        }
        break;

      case "articles":
        {
          const count = await Article.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const articles = await Article.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id");
          totalPage = objetPagination.totalPage
          data = articles;
        }
        break;

      case "banners":
        {
          const count = await Banner.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const banners = await Banner.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id");
          totalPage = objetPagination.totalPage
          data = banners;
        }
        break;

      case "users":
        {
          const count = await User.countDocuments({ deleted: true });
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const users = await User.find({ deleted: true })
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("fullName email phone avatar");
          totalPage = objetPagination.totalPage
          data = users;
        }
        break;

      case "accounts":
        {
          const count = await Account.countDocuments({ deleted: true });
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const accounts = await Account.find({ deleted: true })
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("fullName email phone avatar");
          totalPage = objetPagination.totalPage
          data = accounts;
        }
        break;

      case "vouchers":
        {
          const count = await Voucher.countDocuments(find);
          const objetPagination = panigationHelper(
            initPagination,
            req.query,
            count
          );
          // end phân trang

          const vouchers = await Voucher.find(find)
            .limit(objetPagination.limitItems)
            .skip(objetPagination.skip)
            .lean().select("title thumbnail _id");
          totalPage = objetPagination.totalPage
          data = vouchers;
        }
        break;

      default:
        break;
    }

    res.json({
      code: 200,
      data: data,
      totalPage: totalPage
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi server ${error.message}`
    });
  }
}

// [GET] /trashs/restore/:typeItem/:idItem
module.exports.restoreItem = async (req, res) => {
  try {
    const typeItem = req.params.typeItem
    const idItem = req.params.idItem;

    switch (typeItem) {
      case "product":
        {
          const product = await Product.findByIdAndUpdate(idItem, { deleted: false }).lean();

          if (!product) {
            res.json({
              code: 404,
              message: "Không tồn tại sản phẩm"
            });
            return;
          }
        }
        break;

      case "category":
        {
          const category = await ProductCategory.findByIdAndUpdate(idItem, { deleted: false }).lean();

          if (!category) {
            res.json({
              code: 404,
              message: "Không tồn tại danh mục"
            });
            return;
          }
        }
        break;

      case "article":
        {
          const article = await Article.findByIdAndUpdate(idItem, { deleted: false }).lean();

          if (!article) {
            res.json({
              code: 404,
              message: "Không tồn tại bài viết"
            });
            return;
          }
        }
        break;

      case "banner":
        {
          const banner = await Banner.findByIdAndUpdate(idItem, { deleted: false }).lean();

          if (!banner) {
            res.json({
              code: 404,
              message: "Không tồn tại quảng cáo"
            });
            return;
          }
        }
        break;

      case "voucher":
        {
          const voucher = await Voucher.findByIdAndUpdate(idItem, { deleted: false }).lean();

          if (!voucher) {
            res.json({
              code: 404,
              message: "Không tồn tại voucher"
            });
            return;
          }
        }
        break;

      case "account":
        {
          const account = await Account.findByIdAndUpdate(idItem, { deleted: false }).lean();

          if (!account) {
            res.json({
              code: 404,
              message: "Không tồn tại account"
            });
            return;
          }
        }
        break;

      case "user":
        {
          const user = await User.findByIdAndUpdate(idItem, { deleted: false }).lean();

          if (!user) {
            res.json({
              code: 404,
              message: "Không tồn tại user"
            });
            return;
          }
        }
        break;

      default:
        break;
    }

    res.json({
      code: 200,
      message: "Khôi phục thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi server ${error.message}`
    });
  }
}

// [GET] /trashs/permanent-delete/:typeItem/:idItem
module.exports.permanentItem = async (req, res) => {
  try {
    const typeItem = req.params.typeItem
    const idItem = req.params.idItem;

    switch (typeItem) {
      case "product":
        {
          const product = await Product.findByIdAndDelete(idItem).lean();

          if (!product) {
            res.json({
              code: 404,
              message: "Không tồn tại sản phẩm"
            });
            return;
          }
        }
        break;

      case "category":
        {
          const category = await ProductCategory.findByIdAndDelete(idItem).lean();

          if (!category) {
            res.json({
              code: 404,
              message: "Không tồn tại danh mục"
            });
            return;
          }
        }
        break;

      case "article":
        {
          const article = await Article.findByIdAndDelete(idItem).lean();

          if (!article) {
            res.json({
              code: 404,
              message: "Không tồn tại bài viết"
            });
            return;
          }
        }
        break;

      case "banner":
        {
          const banner = await Banner.findByIdAndDelete(idItem).lean();

          if (!banner) {
            res.json({
              code: 404,
              message: "Không tồn tại quảng cáo"
            });
            return;
          }
        }
        break;

      case "voucher":
        {
          const voucher = await Voucher.findByIdAndDelete(idItem).lean();

          if (!voucher) {
            res.json({
              code: 404,
              message: "Không tồn tại voucher"
            });
            return;
          }
        }
        break;

      case "account":
        {
          const account = await Account.findByIdAndDelete(idItem).lean();

          if (!account) {
            res.json({
              code: 404,
              message: "Không tồn tại account"
            });
            return;
          }
        }
        break;

      case "user":
        {
          const user = await User.findByIdAndDelete(idItem).lean();
          console.log(idItem);

          if (!user) {
            res.json({
              code: 404,
              message: "Không tồn tại user"
            });
            return;
          }
        }
        break;

      default:
        break;
    }

    res.json({
      code: 200,
      message: "Xóa vĩnh viễn thành công!"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: `Lỗi server ${error.message}`
    });
  }

}
