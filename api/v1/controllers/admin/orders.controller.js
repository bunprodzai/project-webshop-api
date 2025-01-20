// file này dùng để tạo hàm render ra giao diện 
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

const productHelper = require("../../../../helpers/products");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
  if (req.role.permissions.includes("orders_view")) {
    let sales = 0;
    const records = await Order.find().lean();

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
      sales: sales
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

          item.newPrice = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0);
          item.totalPrice = item.newPrice * item.quantity;

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

// [GET] /admin/orders/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    if (req.role.permissions.includes("orders_view")) {
      const code = req.params.code;
      const status = req.params.status;

      const order = await Order.findOne({ code: code, status: "received" });
      
      if (order) {
        if (order.products.length > 0) {
          for (const product of order.products) {
            const productId = product.product_id;
            const productOld = await Product.findOne({ _id: productId });
            await Product.updateOne({ _id: productId }, { stock: productOld.stock - product.quantity });
          }
        }
        await Order.updateOne({ code: code }, { status: status });
        res.json({
          code: 200,
          message: "Đơn hàng đã hoàn thành"
        });
      } else {
        res.json({
          code: 400,
          message: "Đơn hàng không tồn tại"
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