const ProductCategory = require("../../models/product.category.model");

// [GET] /api/v1/products-category
module.exports.index = async (req, res) => {
  try {
    const find = { deleted: false };
    const sort = {};

    // Kiểm tra và thêm sắp xếp nếu có
    if (req.query.sortKey && req.query.sortType) {
      const { sortKey, sortType } = req.query;

      // Đảm bảo sortType là `asc` hoặc `desc`
      if (["asc", "desc"].includes(sortType)) {
        sort[sortKey] = sortType === "asc" ? 1 : -1;
      }
    }

    // Truy vấn cơ sở dữ liệu
    const records = await ProductCategory.find(find).sort(sort);

    res.json({
      code: 200,
      productsCategory: records,
    });
  } catch (error) {
    console.error("Lỗi khi truy vấn danh mục sản phẩm:", error.message);

    res.status(500).json({
      code: 500,
      message: "Đã xảy ra lỗi khi lấy danh mục sản phẩm!",
    });
  }
};

// [POST] /api/v1/products-category/create
module.exports.createPost = async (req, res) => {
  try {
    if (!req.body.position) {
      const countItem = await ProductCategory.countDocuments({ deleted: false });
      req.body.position = countItem + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    if (req.body.parent_id) {
      const existCategory = await ProductCategory.findOne({ _id: req.body.parent_id });
      if (existCategory) {
        const record = new ProductCategory(req.body);
        await record.save();

        res.json({
          code: 200,
          message: "Thêm mới thành công!",
          productsCategory: record
        });
      }
    } else {
      const record = new ProductCategory(req.body);
      await record.save();

      res.json({
        code: 200,
        message: "Thêm mới thành công!",
        productsCategory: record
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Thêm mới không thành công!"
    });
  }
}

// [PATCH] /api/v1/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await ProductCategory.findOne({ _id: id });

    if (category) {
      if (req.body.position) {
        req.body.position = parseInt(req.body.position);
      }

      const dataEdit = req.body;

      await ProductCategory.updateOne({
        _id: id
      }, dataEdit);

      res.json({
        code: 200,
        message: "Chỉnh sửa thành công!"
      });
    } else {
      res.json({
        code: 400,
        message: "Không tồn tại danh mục này!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Chỉnh sửa không thành công!"
    });
  }
}

// [DELETE] /api/v1/products-category/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await ProductCategory.findOne({ _id: id });
    
    if (category) {
      await ProductCategory.updateOne({
        _id: id
      }, {
        deleted: true,
        deteledAt: new Date()
      });

      res.json({
        code: 200,
        message: "Xóa thành công"
      });
    } else {
      res.json({
        code: 400,
        message: "Không tồn tại danh mục này!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }
}

// [GET] /api/v1/products-category/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    await ProductCategory.updateOne({
      _id: id
    }, {
      status: status
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
}
