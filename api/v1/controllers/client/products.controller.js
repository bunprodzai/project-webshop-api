const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product.category.model");
const Review = require("../../models/review.model");
const FavoriteProduct = require("../../models/favorite-products.model");
const User = require("../../models/users.model");
const mongoose = require("mongoose");
const productsHelper = require("../../../../helpers/products");
const productsCategoryHelper = require("../../../../helpers/products-category");


// [GET] /products
module.exports.index = async (req, res) => {

  const products = await Product.find({
    deleted: false,
    status: "active"
  }).lean().select("-updatedBy -createdAt -updatedAt -createBy");

  res.json({
    code: 200,
    message: "Lấy danh sách sản phẩm thành công",
    data: products
  });
}

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    // dùng để tìm kiếm danh sách sản phẩm theo danh mục
    const slugCategory = req.params.slugCategory;

    const category = await ProductCategory.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active"
    });

    const allChildren = await productsCategoryHelper.getChildrenCategory(category._id);
    const listChildrenId = allChildren.map(item => item._id);

    const find = {
      deleted: false,
      status: "active",
      product_category_id: { $in: [category.id, ...listChildrenId] }
    }
    // sort
    const sort = {}

    if (req.query.sortKey && req.query.sortType) {
      const sortKey = req.query.sortKey;
      const sortType = req.query.sortType;
      if (sortKey === "default") {

      } else {
        sort[sortKey] = sortType // [] dùng để truyền linh động, còn sort.sortKey là truyền cứng
      }
    }

    const priceParam = req.query.priceRange;
    if (priceParam.length > 0) {
      const [min, max] = priceParam.split('-');
      const minPrice = Number(min);
      const maxPrice = Number(max);

      if (minPrice === 0 && maxPrice === 0) {
        // Trường hợp "0-0" hoặc không có giá trị hợp lệ
      } else if (!isNaN(maxPrice) && minPrice === 0) {
        // Trường hợp "0-50"
        find.price = { $lte: maxPrice };

      } else if (!isNaN(minPrice) && maxPrice === 0) {
        // Trường hợp "100-"
        find.price = { $gte: minPrice };
      } else if (!isNaN(maxPrice) && !isNaN(minPrice)) {
        // Trường hợp "50-100" hoặc "500"
        find.price = { $gte: minPrice, $lte: maxPrice };
      }
    }
    // Lấy danh sách products
    const products = productsHelper.priceNewProducts(await Product.find(find).sort(sort)
    );

    res.json({
      code: 200,
      message: "Lấy danh sách sản phẩm thành công",
      products: products,
      category: category
    });
  } catch (error) {
    console.log("Loi o day");
    res.json({
      code: 400,
      message: "Lỗi!" + error.message
    });
  }
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const record = await Product.findOne({
      slug: slug
    }).lean().select("-updatedBy -createdAt -updatedAt -createBy");

    if (record.product_category_id !== "") {
      const productCategory = await ProductCategory.findOne({ _id: record.product_category_id });
      record.titleCategory = productCategory.title;
      record.slugCategory = productCategory.slug;
    }

    const newRecord = productsHelper.priceNewProduct(record);

    res.json({
      code: 200,
      message: "Lấy chi tiết sản phẩm thành công",
      data: newRecord
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}

// [GET] /products/reviews/:productId
module.exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: new mongoose.Types.ObjectId(String(productId)), deleted: false })
      .populate("user", "fullName")           // lấy thông tin người đánh giá
      .populate("replies.user", "fullName")   // lấy thông tin người trả lời
      .sort({ createdAt: -1 });

    res.json({
      code: 200,
      message: "Lấy danh sách đánh giá thành công",
      data: reviews
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      code: 500,
      message: "Lỗi server"
    });
  }
}

// [POST] /products/reviews/:productId
module.exports.postReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, content } = req.body;
    const userId = req.user.id; // ✅ lấy từ token sau khi login

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(204).json({
        code: 204,
        message: "Không tìm thấy user"
      });
      return;
    }

    // tạo review
    const review = await Review.create({
      product: new mongoose.Types.ObjectId(String(productId)),
      user: new mongoose.Types.ObjectId(String(userId)),
      rating,
      content
    });

    res.status(201).json({
      code: 201,
      message: "Đánh giá sản phẩm thành công",
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Lỗi server" });
  }
}

// [POST] /reviews/:reviewId/replies
module.exports.addReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, role } = req.body;
    const userId = req.user.id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(204).json({
        code: 204,
        message: "Không tìm thấy user"
      });
      return;
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        $push: {
          replies: {
            user: userId ? new mongoose.Types.ObjectId(String(userId)) : null,
            content,
            role: role || "customer"
          }
        }
      },
      { new: true }
    )
      .populate("user", "fullName email")
      .populate("replies.user", "fullName email");

    if (!review) {
      return res.status(404).json({ code: 404, message: "Không tìm thấy review" });
    }

    res.json({
      code: 200,
      message: "Thêm phản hồi thành công"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: "Lỗi server" + error.message });
  }
};

// [DELETE] /products/reviews/delete/:reviewId
module.exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    await Review.findByIdAndUpdate(reviewId, { deleted: true });

    const userId = req.user.id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(204).json({
        code: 204,
        message: "Không tìm thấy user"
      });
      return;
    }

    res.json({
      code: 200,
      message: "Xóa đánh giá thành công"
    })

  } catch (error) {
    res.json({
      code: 400,
      message: "Đã có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại sau!"
    })
  }
}

// [DELETE] /products/reviews/delete/:reviewId
module.exports.deleteReply = async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const replyId = req.params.replyId;

    const userId = req.user.id;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      res.status(204).json({
        code: 204,
        message: "Không tìm thấy user"
      });
    }

    const review = await Review.findByIdAndUpdate(reviewId, { $pull: { replies: { _id: replyId } } });

    if (!review) {
      return res.status(404).json({ code: 404, message: "Không tìm thấy review" });
    }

    res.json({
      code: 200,
      message: "Xóa đánh giá thành công"
    })

  } catch (error) {
    res.json({
      code: 400,
      message: "Đã có lỗi xảy ra khi xóa đánh giá. Vui lòng thử lại sau!"
    })
  }
}

// [GET] /products
module.exports.favoriteProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("favorites");
    // Lấy mảng product_id
    const favoriteIds = user.favorites.map(fav => fav.product_id);

    // Query sản phẩm theo danh sách id
    const products = await Product.find({
      deleted: false,
      _id: { $in: favoriteIds }
    });

    res.json({
      code: 200,
      message: "Danh sách sản phẩm yêu thích",
      data: products
    });

  } catch (error) {
    console.log(error.message);
    res.json({
      code: 400,
      message: error.message
    });
  }
}

// [PATCh] /products/
module.exports.favorite = async (req, res) => {
  try {
    const userId = req.user.id; // user đã login
    const productId = req.params.productId;
    const typeFavorite = req.params.typeFavorite;

    switch (typeFavorite) {
      case "favorite": {
        // kiểm tra đã tồn tại chưa
        const user = await User.findOne({ _id: userId });

        const existFavorite = user.favorites.
          find(item => item.product_id === productId);

        if (!existFavorite) {
          await User.updateOne(
            { _id: userId },
            { $addToSet: { favorites: { product_id: productId } } } // $addToSet tránh trùng
          );
          return res.json({
            code: 200,
            message: "Yêu thích thành công"
          });
        }
      }

      case "unfavorite": {
        await User.updateOne(
          { _id: userId },
          { $pull: { favorites: { product_id: productId } } } // $pull xóa khỏi array
        );
        return res.json({
          code: 201,
          message: "Hủy yêu thích thành công"
        });
      }

      default:
        return res.json({
          code: 400,
          message: "Loại thao tác không hợp lệ"
        });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server"
    });
  }
}