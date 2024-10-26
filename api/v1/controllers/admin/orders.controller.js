// file này dùng để tạo hàm render ra giao diện 
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const panigationHelper = require("../../../../helpers/pagination");
const productHelper = require("../../../../helpers/products");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
  if (req.role.permissions.includes("orders_view")) {
    // pagination 
    let initPagination = {
      currentPage: 1,
      limitItems: 5
    };
    const countOrder = await Order.countDocuments({});
    const objetPagination = panigationHelper(
      initPagination,
      req.query,
      countOrder
    )
    // end pagination 

    let sales = 0;

    const records = await Order.find().lean().limit(objetPagination.limitItems)
      .skip(objetPagination.skip);

    for (const item of records) {
      if (item.products.length > 0) {
        let totalPrice = 0;
        let totalQuantity = 0;
        for (const product of item.products) {
          const priceNew = productHelper.priceNew(product);
          totalPrice += priceNew * product.quantity;
          totalQuantity += product.quantity;
        }
        item.totalOrder = totalPrice;
        sales += item.totalOrder;
        item.totalQuantity = totalQuantity;
      }
    }

    res.json({
      code: 200,
      message: "Quản lý đơn hàng",
      records: records,
      sales: sales,
      pagination: objetPagination
    });
  } else {
    res.json({
      code: 403,
      message: "Bạn không có quyền truy cập"
    });
  }
}

// [GET] /admin/orders
module.exports.detail = async (req, res) => {
  try {
    if (req.role.permissions.includes("orders_view")) {
      const id = req.params.id;

      const record = await Order.findOne({ _id: id }).lean();
      if (record.products.length > 0) {
        for (const item of record.products) {
          const productId = item.product_id;

          const productInfo = await Product.findOne({ _id: productId, deleted: false, status: "active" }).select("title");

          item.priceNew = productHelper.priceNew(item);
          item.totalPrice = item.priceNew * item.quantity;

          item.title = productInfo.title;
        }
      }
      record.totalPriceProducts = record.products.reduce((sum, item) => item.totalPrice + sum, 0);
      res.json({
        code: 200,
        message: "Chi tiết đơn hàng",
        record: record
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