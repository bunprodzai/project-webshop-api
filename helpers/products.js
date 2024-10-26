module.exports.priceNewProducts = (products) => {
  const newProducts = products.map((item) => {
    (item.newPrice = (item.price * (100 - item.discountPercentage)) / 100).toFixed(0);
    return item;
  })
  return newProducts;
}

module.exports.priceNewProduct = (products) => {
  products.newPrice = ((products.price * (100 - products.discountPercentage)) / 100).toFixed(0);
  return products;
}

module.exports.priceNew = (products) => {
  products.newPrice = ((products.price * (100 - products.discountPercentage)) / 100).toFixed(0);
  return products.newPrice;
}