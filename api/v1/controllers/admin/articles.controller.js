const Article = require("../../models/articles.model");
const Account = require("../../models/account.model");

// [GET] /article/
module.exports.index = async (req, res) => {
  try {
    if (req.role.permissions.includes("articles_view")) {
      const records = await Article.find({ deleted: false }).lean();

      for (const item of records) {
        const account = await Account.findOne({ deleted: false, _id: item.createBy.user_Id });
        // add thêm key fullName vào item
        if (account) {
          item.fullName = account.fullName;
        }

        // add thêm key fullName vào updatedBy
        item.updatedBy = item.updatedBy.map(async (entry) => {
          const userUpdated = await Account.findOne({ _id: entry.user_Id });
          if (userUpdated) {
            return { ...entry, fullName: userUpdated.fullName }; // Thêm key fullName
          }
          return entry;
        });

        // Đợi tất cả các promise trong .map() hoàn thành
        item.updatedBy = await Promise.all(item.updatedBy);
      }

      res.json({
        code: 200,
        message: "Trang bài viết",
        articles: records
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

module.exports.createPost = async (req, res) => {
  try {
    if (req.role.permissions.includes("articles_view")) {
      if (req.body.position == "") {
        const countItem = await Article.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      req.body.createBy = {
        user_Id: req.userAuth.id
      }

      const article = new Article(req.body);
      await article.save();

      res.json({
        code: 200,
        message: "Tạo mới thành công",
        article: article
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

module.exports.editPatch = async (req, res) => {
  try {
    if (req.role.permissions.includes("articles_edit")) {
      const id = req.params.id;
      
      if (req.body.position == "") {
        const countItem = await Products.countDocuments({ deleted: false });
        req.body.position = countItem + 1;
      } else {
        req.body.position = parseInt(req.body.position);
      }

      const dataEdit = req.body;
      
      
      const updatedBy = {
        user_Id: req.userAuth.id,
        updatedAt: new Date()
      }

      await Article.updateOne({
        _id: id
      }, { ...dataEdit, $push: { updatedBy: updatedBy } }
      );

      res.json({
        code: 200,
        message: "Chỉnh sửa thành công"
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
      message: error.message
    });
  }
}

module.exports.detail = async (req, res) => {
  try {
    if (req.role.permissions.includes("articles_view")) {
      const id = req.params.id;

      const article = await Article.findOne({ deleted: false, _id: id });

      res.json({
        code: 200,
        message: "Chi tiết bài viết",
        article: article
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

module.exports.delete = async (req, res) => {
  try {
    if (req.role.permissions.includes("articles_del")) {
      const id = req.params.id;

      const article = await Article.findOne({
        _id: id
      });
      const deletedBy = {
        user_Id: req.userAuth.id,
        deletedAt: new Date()
      }
      if (article) {
        await Article.updateOne({
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
          code: 400,
          message: "Không tìm thấy bài viết!"
        });
      }
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