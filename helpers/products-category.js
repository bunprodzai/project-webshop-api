const ProductCategory = require("../api/v1/models/product.category.model");

module.exports.getChildrenCategory = async (parentId) => {
  const getCategory = async (parentId) => {
    const childrenCategory = await ProductCategory.find({
      deleted: false,
      status: "active",
      parent_id: parentId
    });

    let allChildren = [...childrenCategory];

    for (const children of childrenCategory) {
      const childs = await getCategory(children._id);
      allChildren = allChildren.concat(childs);
    }
    return allChildren;
  }
  const result = await getCategory(parentId);
  return result;
}