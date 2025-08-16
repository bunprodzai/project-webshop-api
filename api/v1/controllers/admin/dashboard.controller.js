// file này dùng để tạo hàm render ra giao diện 
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product.category.model");
const Account = require("../../models/account.model");
const User = require("../../models/users.model");
const Order = require("../../models/order.model");
const productHelper = require("../../../../helpers/products");
const { latestRevenue } = require("../../../../helpers/latest-revenue");

// [GET] /api/v1/dashboard
module.exports.dashboard = async (req, res) => {

  // const startOfMonth = new Date(2025, 5, 1); // Tháng 6 (tháng tính từ 0 -> 11)
  // const endOfMonth = new Date(2025, 6, 1);   // Tháng 7 (bắt đầu tháng sau)

  // const orders = await Order.find({
  //   createdAt: {
  //     $gte: startOfMonth,
  //     $lt: endOfMonth
  //   }
  // });

  const statictic = {
    categoryProduct: {
      total: await ProductCategory.countDocuments({ deleted: false }),
      active: await ProductCategory.countDocuments({ deleted: false, status: "active" }),
      inactive: await ProductCategory.countDocuments({ deleted: false, status: "inactive" })
    },
    product: {
      total: (await Product.countDocuments({ deleted: false })).length,
      active: await Product.countDocuments({ deleted: false, status: "active" }),
      inactive: await Product.countDocuments({ deleted: false, status: "inactive" })
    },
    account: {
      total: (await Account.countDocuments({ deleted: false })).length,
      active: await Account.countDocuments({ deleted: false, status: "active" }),
      inactive: await Account.countDocuments({ deleted: false, status: "inactive" })
    },
    user: {
      total: await User.countDocuments({ deleted: false }),
      active: await User.countDocuments({ deleted: false, status: "active" }),
      inactive: await User.countDocuments({ deleted: false, status: "inactive" })
    }
  }


  res.json({
    code: 200,
    message: "Trang dashboard",
    statictic: statictic
  });
}

// Tăng trưởng đơn hàng
// [GET] /api/v1/dashboard/order/percentGrowth/:time
module.exports.orderGrowth = async (req, res) => {
  const [month, year] = req.params.time.split("-").map(Number);
  const currentMonth = new Date(year, month, 1); // Tháng gủi lên trừ đi 1
  const lastMonth = new Date(year, month - 1, 1); // Bắt đầu tháng sau

  const lastMonth2 = new Date(year, month - 2, 1); // Bắt đầu tháng trước đó

  const countOrderCurrent = await Order.countDocuments({
    createdAt: {
      $gte: lastMonth,
      $lt: currentMonth
    }
  });

  const countOrderLast = await Order.countDocuments({
    createdAt: {
      $gte: lastMonth2,
      $lt: lastMonth
    }
  });

  res.json({
    code: 200,
    message: "Tăng truởng đơn hàng",
    countOrderCurrent: countOrderCurrent,
    countOrderLast: countOrderLast
  });
}

// Tăng trưởng sản phẩm
// [GET] /api/v1/dashboard/product/percentGrowth/:time
module.exports.productGrowth = async (req, res) => {
  const [month, year] = req.params.time.split("-").map(Number);
  const currentMonth = new Date(year, month, 1); // Tháng gủi lên trừ đi 1
  const lastMonth = new Date(year, month - 1, 1); // Bắt đầu tháng sau

  const lastMonth2 = new Date(year, month - 2, 1); // Bắt đầu tháng trước đó

  const countProductCurrent = await Product.countDocuments({
    createdAt: {
      $gte: lastMonth,
      $lt: currentMonth
    },
    deleted: false
  });

  const countProductLast = await Product.countDocuments({
    createdAt: {
      $gte: lastMonth2,
      $lt: lastMonth
    },
    deleted: false
  });

  res.json({
    code: 200,
    message: "Tăng truởng sản phẩm",
    countProductCurrent: countProductCurrent,
    countProductLast: countProductLast
  });
}

// Tăng trưởng người dùng
// [GET] /api/v1/dashboard/user/percentGrowth/:time
module.exports.userGrowth = async (req, res) => {
  const [month, year] = req.params.time.split("-").map(Number);
  const currentMonth = new Date(year, month, 1); // Tháng gủi lên trừ đi 1
  const lastMonth = new Date(year, month - 1, 1); // Bắt đầu tháng sau

  const lastMonth2 = new Date(year, month - 2, 1); // Bắt đầu tháng trước đó

  const countUserCurrent = await User.countDocuments({
    createdAt: {
      $gte: lastMonth,
      $lt: currentMonth
    },
    deleted: false
  });

  const countUserLast = await User.countDocuments({
    createdAt: {
      $gte: lastMonth2,
      $lt: lastMonth
    },
    deleted: false
  });

  res.json({
    code: 200,
    message: "Tăng truởng người dùng",
    countUserCurrent: countUserCurrent,
    countUserLast: countUserLast
  });
}

// Danh mục tăng trưởng
// [GET] /api/v1/dashboard/category/percentGrowth/:time
module.exports.categoryGrowth = async (req, res) => {
  const [month, year] = req.params.time.split("-").map(Number);
  const currentMonth = new Date(year, month, 1); // Tháng gủi lên trừ đi 1
  const lastMonth = new Date(year, month - 1, 1); // Bắt đầu tháng sau

  const lastMonth2 = new Date(year, month - 2, 1); // Bắt đầu tháng trước đó

  const countCategoryCurrent = await ProductCategory.countDocuments({
    createdAt: {
      $gte: lastMonth,
      $lt: currentMonth
    },
    deleted: false
  });

  const countCategoryLast = await ProductCategory.countDocuments({
    createdAt: {
      $gte: lastMonth2,
      $lt: lastMonth
    },
    deleted: false
  });

  res.json({
    code: 200,
    message: "Tăng truởng danh mục",
    countCategoryCurrent: countCategoryCurrent,
    countCategoryLast: countCategoryLast
  });
}

// đơn hàng trong tháng hiện tại
// [GET] /api/v1/dashboard/recent-orders
module.exports.recentOrders = async (req, res) => {
  try {
    // Lấy ngày đầu và ngày cuối tháng hiện tại
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Truy vấn các đơn hàng trong tháng hiện tại
    const orders = await Order.find({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    }).lean();

    for (const item of orders) {
      if (item.products.length > 0) {
        let totalPrice = 0;
        for (const product of item.products) {
          const priceNew = productHelper.priceNew(product);
          totalPrice += priceNew * product.quantity;
        }

        item.totalOrder = totalPrice;
      }
    }


    res.status(200).json({
      code: 200,
      message: "Lấy đơn hàng trong tháng hiện tại thành công",
      orders: orders
    });
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng tháng hiện tại:", error);
    res.status(500).json({
      code: 500,
      message: "Lỗi server khi truy vấn đơn hàng"
    });
  }
};

// doanh thu trong 4 tháng gần nhất
// [GET] /api/v1/dashboard/latest-revenue
module.exports.latestRevenue = async (req, res) => {
  try {
    const now = new Date();

    let resultRevenue = [];
    for (var i = 0; i < 4; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const revenue = await latestRevenue(`${year}-${month}`);

      resultRevenue.push(revenue.result[0]);
    }

    res.json({
      code: 200,
      message: "Tăng trưởng doanh thu",
      revenues: resultRevenue
    });

  } catch (err) {
    console.error(err);
    res.json({
      code: 500,
      message: "Lỗi khi tính doanh thu"
    });
  }
};

// thời gian bắt đầu của trang web
// [GET] /api/v1/dashboard/timestart  
module.exports.timeStart = async (req, res) => {
  try {
    const firstProduct = await Product.findOne().sort({ createdAt: 1 });

    const timeLine = [];

    // Khởi tạo dữ liệu tháng bắt đầu
    const now = new Date();
    const endYear = now.getFullYear();
    const endMonth = now.getMonth();

    let year = firstProduct.createdAt.getFullYear();
    let month = firstProduct.createdAt.getMonth() + 1;

    while (year < endYear || (year === endYear && month <= endMonth)) {
      const displayMonth = (month + 1).toString().padStart(2, '0');
      timeLine.push(`${displayMonth}-${year}`);

      month++;
      if (month > 11) {
        month = 0;
        year++;
      }
    }
    res.json({
      code: 200,
      message: "Thời gian bắt đầu",
      timeLine: timeLine
    });
  } catch {
    res.json({
      code: 400,
      message: "Lỗi"
    });
  }

}

// Danh mục bán chạy
// [GET] /api/v1/dashboard/top-selling-category/:time
module.exports.getTopSellingCategories = async (req, res) => {
  try {
    const [month, year] = req.params.time.split("-").map(Number);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await Order.aggregate([
      {
        $match: {
          status: "success",
          createdAt: { $gte: startDate, $lt: endDate }
        }
      },
      { $unwind: "$products" },
      {
        $addFields: {
          "products.product_id": {
            $convert: {
              input: "$products.product_id",
              to: "objectId",
              onError: null,
              onNull: null
            }
          }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $addFields: {
          "productInfo.product_category_id": {
            $convert: {
              input: "$productInfo.product_category_id",
              to: "objectId",
              onError: null,
              onNull: null
            }
          }
        }
      },
      {
        $lookup: {
          from: "products-categorys",
          localField: "productInfo.product_category_id",
          foreignField: "_id",
          as: "categoryInfo"
        }
      },
      { $unwind: "$categoryInfo" },
      {
        $group: {
          _id: "$categoryInfo._id",
          categoryTitle: { $first: "$categoryInfo.title" },
          totalQuantity: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    if (!result.length) {
      return res.status(200).json({ message: "Không có dữ liệu trong tháng này" });
    }

    res.status(200).json({
      code: 200,
      result: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// sản phẩm bán chạy
// [GET] /api/v1/dashboard/top-selling-product/:time
module.exports.getTopSellingProducts = async (req, res) => {
  try {
    const [month, year] = req.params.time.split("-").map(Number);

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const result = await Order.aggregate([
      {
        $match: {
          status: "success", // chỉ tính đơn đã hoàn thành
          createdAt: { $gte: startDate, $lt: endDate }
        }
      },
      { $unwind: "$products" },
      {
        $addFields: {
          "products.product_id": {
            $convert: {
              input: "$products.product_id",
              to: "objectId",
              onError: null,
              onNull: null
            }
          }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $group: {
          _id: "$productInfo._id",
          title: { $first: "$productInfo.title" },
          totalSold: { $sum: "$products.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 } // top 5
    ]);

    if (!result.length) {
      return res.status(200).json({ message: "Không có dữ liệu trong tháng này" });
    }

    res.status(200).json({
      code: 200,
      result: result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

// Hàng tồn kho thấp
// [GET] /api/v1/dashboard/low-stock-products
module.exports.getLowStockProducts = async (req, res) => {
  try {
    const result = await Product.find({ stock: { $lt: 10 } }).select(" _id title stock");
    
    if (!result.length) {
      return res.status(200).json({
        code: 204,
        message: "Không có sản phẩm nào tồn kho thấp"
      });
    }

    res.status(200).json({
      code: 200,
      result: result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
}