const Product = require("../../models/product.model");
const Review = require("../../models/review.model");
const ProductCategory = require("../../models/product.category.model");
const panigationHelper = require("../../../../helpers/pagination");
const searchHelper = require("../../../../helpers/search");

// [GET] /api/v1/products
module.exports.index = async (req, res) => {
  const status = req.query.status;
  const limitItem = req.query.limit;
  const find = {
    deleted: false
  };

  if (status) {
    find.status = status;
  }

  // phân trang 
  let initPagination = {
    currentPage: 1,
    limitItems: limitItem
  };

  const countProduct = await Product.countDocuments(find);
  const objetPagination = panigationHelper(
    initPagination,
    req.query,
    countProduct
  );
  // end phân trang

  // Tìm kiếm
  const objSearch = searchHelper(req.query);

  if (objSearch.regex) {
    find.title = objSearch.regex;
  }
  // /api/v1/products?keyword=samsung url để search
  // end Tìm kiếm

  // sort
  const sort = {}
  if (req.query.sortKey && req.query.sortType) {
    const sortKey = req.query.sortKey;
    const sortType = req.query.sortType;
    sort[sortKey] = sortType // [] dùng để truyền linh động, còn sort.sortKey là truyền cứng
  }
  // }/api/v1/products?sortKey=price&sortType=asc url để query
  // end sort

  const products = await Product.find(find)
    .sort(sort)
    .limit(objetPagination.limitItems)
    .skip(objetPagination.skip);

  res.json({
    code: 200,
    data: products,
    totalPage: objetPagination.totalPage
  });
}

// [POST] /api/v1/products/create-item
module.exports.createItem = async (req, res) => {
  try {
    req.body.price = parseFloat(req.body.price);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage);

    if (!req.body.position) {
      const countItem = await Product.countDocuments({ deleted: false });
      req.body.position = countItem + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    if (req.body.product_category_id !== "") {
      const category = await ProductCategory.findOne({
        _id: req.body.product_category_id,
      });
      req.body.categoryTitle = category.title;
    }

    if (Array.isArray(req.body.sizeStock)) {
      const totalStock = req.body.sizeStock.reduce((sum, item) => {
        const parts = item.split("-");
        const quantity = parseInt(parts[1], 10);
        return sum + (isNaN(quantity) ? 0 : quantity);
      }, 0);

      req.body.stock = totalStock;
    }

    req.body.createBy = {
      user_Id: req.userAuth.id
    }

    const product = new Product(req.body);
    await product.save();
    res.json({
      code: 200,
      message: "Tạo mới thành công",
      data: product
    });
  } catch (error) {

    res.json({
      code: 400,
      message: "Tạo mới sản phẩm không thành công! - " + error
    });
  }
  // /api/v1/products/create-item 
  // {
  //   "title": "Mo ta san pham 3",
  //   "description": "mo ta san pham 3",
  //   "price": 212,
  //   "discountPercentage": 5,
  //   "stock": 23,
  //   "status": "active",
  //   "position": 21,
  //   "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
  // }
}

// [GET] /api/v1/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    const updatedBy = {
      user_Id: req.userAuth.id,
      updatedAt: new Date()
    }

    await Product.updateOne({
      _id: id
    }, {
      status: status,
      $push: { updatedBy: updatedBy }
    })

    res.json({
      code: 200,
      message: "Cập nhập trạng thái thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }
  // bên phía client sẽ gửi yêu cầu lên params : /api/v1/products/change-status/active/669f264330dd29a6f8ad7bc3
}

// [PATCH] /api/v1/products/edit-item/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    ["position", "price", "discountPercentage"].forEach((k) => {
      if (req.body[k]) req.body[k] = parseFloat(req.body[k]);
    });

    if (req.body.product_category_id !== "") {
      const category = await ProductCategory.findOne({
        _id: req.body.product_category_id,
      });
      req.body.categoryTitle = category.title;
    }

    if (Array.isArray(req.body.sizeStock)) {
      const totalStock = req.body.sizeStock.reduce((sum, item) => {
        const parts = item.split("-");
        const quantity = parseInt(parts[1], 10);
        return sum + (isNaN(quantity) ? 0 : quantity);
      }, 0);

      req.body.stock = totalStock;
    }

    const { ...dataEdit } = req.body;

    const updatedBy = {
      user_Id: req.userAuth.id,
      updatedAt: new Date()
    }

    const updateQuery = {
      $set: dataEdit,            // mọi field khác
      $push: { updatedBy }       // log lịch sử
    };

    await Product.updateOne({
      _id: id
    }, updateQuery);

    res.json({
      code: 200,
      message: "Chỉnh sửa thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }
}

// [DELETE] /api/v1/products/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedBy = {
      user_Id: req.userAuth.id,
      deletedAt: new Date()
    }

    await Product.updateOne({
      _id: id
    }, {
      deleted: true,
      deteledAt: new Date(),
      deletedBy: deletedBy
    });

    res.json({
      code: 200,
      message: "Xóa thành công"
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({
      deleted: false,
      _id: id
    });

    res.json({
      code: 200,
      message: "Lấy chi tiết sản phẩm thành công",
      product: product
    })
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    })
  }
}

// [POST] /reviews/:reviewId/replies
module.exports.addReply = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { content, role } = req.body;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      {
        $push: {
          replies: {
            user: null,
            content,
            role: role || "admin"
          }
        }
      },
      { new: true }
    )

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