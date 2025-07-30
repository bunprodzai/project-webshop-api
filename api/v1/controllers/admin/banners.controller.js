const Banner = require("../../models/banner.model");
const panigationHelper = require("../../../../helpers/pagination");
const searchHelper = require("../../../../helpers/search");


// [GET] /api/v1/banners
module.exports.index = async (req, res) => {
  try {
    if (req.role.permissions.includes("banners_view")) {

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

      const countBanner = await Banner.countDocuments(find);
      const objetPagination = panigationHelper(
        initPagination,
        req.query,
        countBanner
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

      const banners = await Banner.find(find)
        .sort(sort)
        .limit(objetPagination.limitItems)
        .skip(objetPagination.skip);

      res.json({
        code: 200,
        banners: banners,
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

// [POST]
module.exports.createPost = async (req, res) => {
  try {
    if (req.role.permissions.includes("banners_view")) {
      if (req.body.position == "") {
        const countItem = await Banner.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      req.body.createBy = {
        user_Id: req.userAuth.id
      }

      const banner = new Banner(req.body);
      await banner.save();

      res.json({
        code: 200,
        message: "Tạo mới thành công",
        banner: banner
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

// [PATCH]
module.exports.editPatch = async (req, res) => {
  try {
    if (req.role.permissions.includes("banners_edit")) {
      const id = req.params.id;

      if (req.body.position == "") {
        const countItem = await Banner.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
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

      await Banner.updateOne({
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
    res.json({
      code: 400,
      message: "Không tồn tại"
    });
  }

}

// [DELETE]
module.exports.delDelete = async (req, res) => {
  try {
    if (req.role.permissions.includes("banners_del")) {
      const id = req.params.id;

      const deletedBy = {
        user_Id: req.userAuth.id,
        deletedAt: new Date()
      }

      await Banner.updateOne({
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

// [GET]
module.exports.changeStatus = async (req, res) => {
  try {
    if (req.role.permissions.includes("banners_edit")) {
      const id = req.params.id;
      const status = req.params.status;

      const updatedBy = {
        user_Id: req.userAuth.id,
        updatedAt: new Date()
      }

      await Banner.updateOne({
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