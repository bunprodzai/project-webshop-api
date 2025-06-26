const Order = require("../api/v1/models/order.model");
const { calculateTotalPrice } = require("./calculateTotal");

module.exports.latestRevenue = async (time) => {
  try {
    const [year, month] = time.split("-").map(Number);
    const endDate = new Date(year, month, 1);
    const startDate = new Date(year, month - 1, 1);

    const orders = await Order.find({
      createdAt: { $gte: startDate, $lt: endDate }
    }).lean();

    // Khởi tạo kết quả mặc định
    const key = `${year}-${String(month).padStart(2, '0')}`;
    let totalRevenue = 0;

    if (orders.length > 0) {
      orders.forEach(order => {
        const total = calculateTotalPrice(order.products);
        totalRevenue += total;
      });
    }

    const result = [
      {
        time: key,
        totalRevenue: Math.round(totalRevenue)
      }
    ];

    return {
      result,
      message: "Tính doanh thu thành công"
    };

  } catch (err) {
    return {
      result: [],
      message: "Lỗi khi tính doanh thu"
    };
  }
};
