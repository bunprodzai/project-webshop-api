module.exports.updateSizeStock = (sizeStock, size, newQuantity) => {
  const updated = sizeStock.map(item => {
    const [itemSize, quantity] = item.split("-");
    if (itemSize === size) {
      return `${size}-${newQuantity}`;
    }
    return item;
  });
  return updated;
}