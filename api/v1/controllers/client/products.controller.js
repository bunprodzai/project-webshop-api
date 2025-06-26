const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product.category.model");

const productsHelper = require("../../../../helpers/products");
const productsCategoryHelper = require("../../../../helpers/products-category");

// [GET] /products
module.exports.index = async (req, res) => {

  const products = await Product.find({
    deleted: false,
    status: "active"
  }).lean().select("-updatedBy -createdAt -updatedAt -createBy");

  // const newProducts = productsHelper.priceNewProducts(products);

  res.json({
    code: 200,
    message: "Lấy danh sách sản phẩm thành công",
    products: products
  });
}


// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    // dùng để tìm kiếm danh sách sản phẩm theo danh mục
    const slugCategory = req.params.slugCategory;
    console.log(req.query);
    
    const category = await ProductCategory.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active"
    });

    const allChildren = await productsCategoryHelper.getChildrenCategory(category.id);

    const listChildrenId = allChildren.map(item => item.id);

    const find = {
      deleted: false,
      status: "active",
      product_category_id: { $in: [category.id, ...listChildrenId] }
    };

    // sort
    const sort = {}

    if (req.query.sortKey && req.query.sortType) {
      const sortKey = req.query.sortKey;
      const sortType = req.query.sortType;
      if (sortKey === "default") {

      } else {
        sort[sortKey] = sortType // [] dùng để truyền linh động, còn sort.sortKey là truyền cứng
      }
    }

    const priceParam = req.query.priceRange;
    if (priceParam.length > 0) {
      const [min, max] = priceParam.split('-');
      const minPrice = Number(min);
      const maxPrice = Number(max);

      if (minPrice === 0 && maxPrice === 0) {
        // Trường hợp "0-0" hoặc không có giá trị hợp lệ
      } else if (!isNaN(maxPrice) && minPrice === 0) {
        // Trường hợp "0-50"
        find.price = { $lte: maxPrice };

      } else if (!isNaN(minPrice) && maxPrice === 0) {
        // Trường hợp "100-"
        find.price = { $gte: minPrice };
      } else if (!isNaN(maxPrice) && !isNaN(minPrice)) {
        // Trường hợp "50-100" hoặc "500"
        find.price = { $gte: minPrice, $lte: maxPrice };
      }
    }


    // Lấy danh sách products
    const products = productsHelper.priceNewProducts(await Product.find(find).sort(sort)
    );

    res.json({
      code: 200,
      message: "Lấy danh sách sản phẩm thành công",
      products: products,
      category: category
    });
  } catch (error) {
    console.log("Loi");

    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;

    const record = await Product.findOne({
      slug: slug
    }).lean().select("-updatedBy -createdAt -updatedAt -createBy");

    if (record.product_category_id !== "") {
      const productCategory = await ProductCategory.findOne({ _id: record.product_category_id });
      record.titleCategory = productCategory.title;
      record.slugCategory = productCategory.slug;
    }

    const newRecord = productsHelper.priceNewProduct(record);

    res.json({
      code: 200,
      message: "Lấy chi tiết sản phẩm thành công",
      record: newRecord
    });
  } catch (error) {
    res.json({
      code: 400,
      message: "Lỗi!"
    });
  }
}