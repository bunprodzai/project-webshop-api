// file này dùng để tạo hàm render ra giao diện 
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");
const sendMailHelper = require("../../../../helpers/sendMail");
const productHelper = require("../../../../helpers/products");
const { updateSizeStock } = require("../../../../helpers/updateSizeStock");
const { getQuantityBySize } = require("../../../../helpers/getQuantityBySize");
const { renderProductsTable } = require("../../../../helpers/renderProductsTable");

// [GET] /admin/orders
module.exports.index = async (req, res) => {
  if (req.role.permissions.includes("orders_view")) {
    let sales = 0;
    const records = await Order.find().sort({ createdAt: -1 }).lean();

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

          const productInfo = await Product.findOne({
            _id: productId,
            deleted: false,
            status: "active"
          }).select("title");

          item.newPrice = ((item.price * (100 - item.discountPercentage)) / 100).toFixed(0);
          item.totalPrice = item.newPrice * item.quantity;

          item.title = productInfo ? productInfo.title : "[Sản phẩm đã bị xóa]";
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
    console.log(error);

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
      const order = await Order.findOne({ code: code });

      if (!order) {
        res.json({
          code: 400,
          message: "Đơn hàng không tồn tại"
        });
        return;
      }

      if (status === "received") {
        const products = [];
        let totalPrice = 0; // tổng tiền của đơn hàng
        let totalQuantity = 0;
        if (order.products.length > 0) {
          // tổng số lượng sản phẩm của đơn hàng
          for (const product of order.products) {
            const priceNew = productHelper.priceNew(product);

            totalPrice += priceNew * product.quantity;
            totalQuantity += product.quantity;

            const infoProduct = await Product.findOne({ _id: product.product_id, deleted: false, status: "active" }).select("title discountPercentage");

            const objProducts = {
              priceNew: priceNew,
              quantity: product.quantity,
              discountPercentage: infoProduct.discountPercentage,
              size: product.size,
              title: infoProduct.title,
              totalPrice: priceNew * product.quantity
            }
            products.push(objProducts);
          }
        }

        // gửi opt qua email user
        const subject = "Đơn hàng của bạn đã được xác nhận, đơn hàng sẽ được giao đến bạn sớm nhất";
        const productsTableHTML = renderProductsTable(products); // `products` là mảng bạn đã có

        const html = `
          <p>Cảm ơn bạn đã đặt hàng tại cửa hàng chúng tôi!</p>
          <p><b>Mã đơn hàng:</b> ${order.code}</p>
          <p><b>Tên khách hàng:</b> ${order.userInfo.fullName}</p>
          <p><b>Phương thức thanh toán:</b> ${order.paymentMethod}</p>
          <br/>
          <p><b>Chi tiết đơn hàng:</b></p>
          ${productsTableHTML}
          <br/>
          <p><b>Tổng số lượng sản phẩm</b> ${totalQuantity}</p>
          <p><b>Tổng tiền đơn hàng</b> ${totalPrice}</p>
          <p>Trân trọng,<br/>Cửa hàng XYZ</p>
          `;
        sendMailHelper.sendMail(order.userInfo.email, subject, html);

        await Order.updateOne({ code: code }, { status: status });

        res.json({
          code: 200,
          message: "Đơn hàng đã được xác nhận"
        });

      } else if (status === "success") {

        if (order.products.length > 0) {
          for (const product of order.products) {
            const productId = product.product_id;
            const productOld = await Product.findOne({ _id: productId });
            const quantityStock = getQuantityBySize(productOld.sizeStock, product.size);
            const updatedSizeStock = updateSizeStock(productOld.sizeStock, product.size, quantityStock - product.quantity);
            await Product.updateOne({ _id: productId }, { sizeStock: updatedSizeStock, stock: productOld.stock - product.quantity });
          }
        }

        res.json({
          code: 200,
          message: "Đơn hàng đã được hoàn thành"
        });
      }

    } else {
      res.json({
        code: 403,
        message: "Bạn không có quyền truy cập"
      });
    }
  } catch (error) {
    console.log(error);

    res.json({
      code: 400,
      message: "Lỗi params"
    });
  }
}