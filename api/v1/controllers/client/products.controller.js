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

    const category = await ProductCategory.findOne({
      slug: slugCategory,
      deleted: false,
      status: "active"
    });


    const allChildren = await productsCategoryHelper.getChildrenCategory(category.id);

    const listChildrenId = allChildren.map(item => item.id);

    const products = productsHelper.priceNewProducts(await Product.find({
      deleted: false,
      status: "active",
      product_category_id: { $in: [category.id, ...listChildrenId] }
    }).sort({ position: "desc" })
    );

    res.json({
      code: 200,
      message: "Lấy danh sách sản phẩm thành công",
      productsCategory: products,
      category: category
    });
  } catch (error) {
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