module.exports.calculateTotalPrice = (products) => {
  if (!Array.isArray(products)) return 0;

  return products.reduce((total, product) => {
    const { price = 0, quantity = 1, discountPercentage = 0 } = product;
    const discount = (price * discountPercentage) / 100;
    const finalPrice = (price - discount) * quantity;
    return total + finalPrice;
  }, 0);
};