const Voucher = require("../../models/voucher.model");
const panigationHelper = require("../../../../helpers/pagination");
const searchHelper = require("../../../../helpers/search");


// [GET] /api/v1/vouchers
module.exports.index = async (req, res) => {
  try {
    if (req.role.permissions.includes("vouchers_view")) {

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

      const countVoucher = await Voucher.countDocuments(find);
      const objetPagination = panigationHelper(
        initPagination,
        req.query,
        countVoucher
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

      const vouchers = await Voucher.find(find)
        .sort(sort)
        .limit(objetPagination.limitItems)
        .skip(objetPagination.skip);

      res.json({
        code: 200,
        vouchers: vouchers,
        totalPage: objetPagination.totalPage
      });

    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền truy cập"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params!"
    });
  }
}

// [POST] /api/v1/vouchers/create
module.exports.createPost = async (req, res) => {
  try {
    if (req.role.permissions.includes("vouchers_create")) {

      req.body.createBy = {
        user_Id: req.userAuth.id
      }

      const voucher = new Voucher(req.body);
      await voucher.save();

      res.json({
        code: 200,
        message: "Tạo mới thành công",
        voucher: voucher
      });
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền truy cập"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}

// [PATCH] /api/v1/vouchers/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    if (req.role.permissions.includes("vouchers_edit")) {
      const id = req.params.id;

      const { ...dataEdit } = req.body;

      const updatedBy = {
        user_Id: req.userAuth.id,
        updatedAt: new Date()
      }

      const updateQuery = {
        $set: dataEdit,            // mọi field khác
        $push: { updatedBy }       // log lịch sử
      };

      await Voucher.updateOne({
        _id: id
      }, updateQuery);

      res.json({
        code: 200,
        message: "Chỉnh sửa thành công"
      });
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền chỉnh sửa quảng cáo!"
      });
    }
  } catch (error) {
    console.log(error.message);
    
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }

}

// [DELETE] /api/v1/vouchers/delete/:id
module.exports.delDelete = async (req, res) => {
  try {
    if (req.role.permissions.includes("vouchers_del")) {
      const id = req.params.id;

      const deletedBy = {
        user_Id: req.userAuth.id,
        deletedAt: new Date()
      }

      await Voucher.updateOne({
        _id: id
      }, {
        deleted: true,
        deletedAt: new Date(),
        deletedBy: deletedBy
      });

      res.json({
        code: 200,
        message: "Xóa thành công"
      });
    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền xóa voucher!"
      });
    }
  } catch (error) {
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }

}

// [GET] /api/v1/vouchers/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    if (req.role.permissions.includes("vouchers_edit")) {
      const id = req.params.id;
      const status = req.params.status;

      const updatedBy = {
        user_Id: req.userAuth.id,
        updatedAt: new Date()
      }

      await Voucher.updateOne({
        _id: id
      }, {
        status: status,
        $push: { updatedBy: updatedBy }
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