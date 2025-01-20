const Role = require("../../models/roles.model");

// [GET] /api/v1/roles
module.exports.index = async (req, res) => {
  if (req.role.permissions.includes("roles_view")) {
    let find = {
      deleted: false
    }
    
    const records = await Role.find(find);

    res.json({
      code: 200,
      roles: records
    });
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền xem danh sách quyền!"
    });
  }

  // /api/v1/roles
}

// [POST] /api/v1/roles/create
module.exports.createPost = async (req, res) => {
  if (req.role.permissions.includes("roles_create")) {
    const record = new Role(req.body);
    record.save();
    res.json({
      code: 200,
      message: "Thêm mới thành công",
      role: record
    });
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền tạo phân quyền!"
    });
  }
  // /api/v1/roles/create
  // {
  //   "title": "Quản trị bài viết",
  //   "description": "Đây là Quản trị bài viết",
  //   "permissions": [
  //     "products-category_view",
  //     "products-category_create",
  //     "products-category_edit",
  //     "products-category_del"
  //   ]
  // }
}

// [PATCH] /api/v1/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    if (req.role.permissions.includes("roles_edit")) {
      const id = req.params.id;
      await Role.updateOne({
        _id: id
      }, req.body);

      res.json({
        code: 200,
        message: "Chỉnh sửa thành công"
      });
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền chỉnh sửa phân quyền!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Chỉnh sửa không thành công"
    });
  }
  // /api/v1/roles/edit/66d07aeea280ab632642fcb1
  // {
  //   "title": "Quản trị bài viết  edit",
  //   "description": "Đây là Quản trị bài viết",
  //   "permissions": [
  //     "products-category_view",
  //     "products-category_create"
  //   ]
  // }
}

// [PATCH] /api/v1/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    if (req.role.permissions.includes("roles_permissions")) {
      const permissions = req.body.permissions;

      for (const item of permissions) {
        await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
      };
      const records = await Role.find({ deleted: false });
      res.json({
        code: 200,
        message: "Cập nhập phân quyền thành công",
        records: records
      })
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền cập nhập phân quyền!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Cập nhập phân quyền không thành công!"
    });
  }
  // /api/v1/roles/permissions
  // {
  //   "permissions": [
  //     {
  //       "id": "66cbf2914024ac6286ceb96a",
  //       "permissions": [
  //         "products-category_view",
  //         "products-category_create",
  //         "products-category_edit",
  //         "products-category_del",
  //         "products_view",
  //         "products_create",
  //         "products_edit",
  //         "products_del",
  //         "roles_view",
  //         "roles_create",
  //         "roles_edit",
  //         "roles_del",
  //         "roles_permissions"
  //       ]
  //     },
  //     {
  //       "id": "66cbf2c33e8c0df9cd6a5de5",
  //       "permissions": [
  //         "products-category_view",
  //         "products-category_create",
  //         "products-category_edit",
  //         "products-category_del",
  //         "products_view",
  //         "products_create",
  //         "products_edit",
  //         "products_del",
  //         "roles_view",
  //         "roles_create",
  //         "roles_edit",
  //         "roles_del",
  //         "roles_permissions"
  //       ]
  //     },
  //     {
  //       "id": "66cc04e11584e9a60ee9dade",
  //       "permissions": [
  //         "roles_view",
  //         "roles_create",
  //         "roles_edit",
  //         "roles_del",
  //         "roles_permissions"
  //       ]
  //     },
  //     {
  //       "id": "66d07aeea280ab632642fcb1",
  //       "permissions": [
  //         "products-category_view",
  //         "products-category_create",
  //         "roles_view",
  //         "roles_create",
  //         "roles_edit",
  //         "roles_del",
  //         "roles_permissions"
  //       ]
  //     }
  //   ]
  // }
}

// [DELETE] /api/v1/roles/delete-item/:id
module.exports.deleteItem = async (req, res) => {
  try {
    if (req.role.permissions.includes("roles_del")) {
      const id = req.params.id;

      await Role.updateOne({
        _id: id
      }, {
        deleted: true,
        deteledAt: new Date()
      });

      res.json({
        code: 200,
        message: "Xóa nhóm quyền thành công"
      });
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền xóa nhóm quyền!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại nhóm quyền này!"
    });
  }
}

module.exports.detail = async (req, res) => {
  try {
    if (req.role.permissions.includes("roles_view")){
      const id = req.params.id;

      const role = await Role.findOne({_id: id});

      res.json({
        code: 200,
        message: "Chi tiết quyền",
        role: role
      });
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền này"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    })
  }
}