module.exports.getQuantityBySize = (sizeStock, size) => {
  const item = sizeStock.find(entry => entry.startsWith(`${size}-`));
  if (!item) return 0;

  const parts = item.split("-");
  return parseInt(parts[1]) || 0;
}