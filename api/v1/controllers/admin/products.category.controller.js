const ProductCategory = require("../../models/product.category.model");

// [GET] /api/v1/products
module.exports.index = async (req, res) => {
  if (req.role.permissions.includes("products-category_view")) {
    let find = {
      deleted: false
    }

    const records = await ProductCategory.find(find);
    res.json({
      code: 200,
      productsCategory: records
    });
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền xem danh mục sản phẩm!"
    });
  }
  // /api/v1/products-category
}

// [POST] /api/v1/products-category/create
module.exports.createPost = async (req, res) => {
  
  try {
    if (req.role.permissions.includes("products-category_create")) {
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
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền tạo danh mục sản phẩm!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Thêm mới không thành công!"
    });
  }


  // /api/v1/products-category/create
  // {
  //   "title": "Công nghệ",
  //   "description": "Mô tả công nghệ",
  //   "status": "active",
  //   "position": 21,
  //   "thumbnail": "https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png"
  // }
}

// [PATCH] /api/v1/products-category/edit/:id
module.exports.editPacth = async (req, res) => {
  try {
    if (req.role.permissions.includes("products-category_edit")) {
      const id = req.params.id;
      console.log(req.body);

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
        code: 403,
        message: "Bạn không có quyền tạo danh mục sản phẩm!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Chỉnh sửa không thành công!"
    });
  }
  // /api/v1/products-category/edit/66c7358439c8357535c37e74
  // {
  //   "title": "Điện thoại Edit 3",
  //   "description": "Điện thoại editt",
  //   "position": 10
  // }
}

// [DELETE] /api/v1/products-category/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  try {
    if (req.role.permissions.includes("products-category_del")) {
      const id = req.params.id;

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
        code: 403,
        message: "Bạn không có quyền xóa sản phẩm!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }
}

// [DELETE] /api/v1/products-category/deletemulti-item
module.exports.deleteMultiItem = async (req, res) => {
  try {
    if (req.role.permissions.includes("products-category_del")) {
      const { ids, key } = req.body;
      console.log(ids);
      
      switch (key) {
        case "delete":
          await ProductCategory.updateMany({
            _id: { $in: ids }
          }, {
            deleted: true,
            deletedAt: new Date()
          });
          res.json({
            code: 200,
            message: "Xóa thành công"
          });
          break;
        default:
          res.json({
            code: 400,
            message: "Không tồn tại"
          });
          break;
      }
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền xóa sản phẩm!"
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
    if (req.role.permissions.includes("products-category_edit")) {
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
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền chỉnh sửa sản phẩm!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }
}
