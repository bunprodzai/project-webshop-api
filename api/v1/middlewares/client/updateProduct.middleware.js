const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

module.exports.updateProduct = async (req, res, next) => {
  // Xử lý cập nhật số lượng sản phẩm
  const orders = await Order.find({ status: "received" });

  for (const item of orders) {
    if (item.products.length > 0) {
      for (const product of item.products) {
        const productId = product.product_id;
        const productOld = await Product.findOne({ _id: productId });
        await Product.updateOne({ _id: productId }, { stock: productOld.stock - product.quantity });
      }
    }
    await Order.updateOne({_id: item._id}, {
      status: "receivedstock"
    })
  }
  next();
  // End xử lý cập nhật số lượng sản phẩm
}