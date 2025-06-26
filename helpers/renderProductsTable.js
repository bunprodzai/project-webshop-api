module.exports.renderProductsTable = (products) => {
  const rows = products.map(p => `
    <tr>
      <td>${p.title}</td>
      <td>${p.size}</td>
      <td>${p.priceNew}</td>
      <td>${p.discountPercentage}%</td>
      <td>${p.quantity}</td>
      <td>${p.totalPrice}</td>
    </tr>
  `).join("");

  return `
    <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%;">
      <thead>
        <tr>
          <th>Tên sản phẩm</th>
          <th>Size</th>
          <th>Đơn giá</th>
          <th>Giảm giá</th>
          <th>Số lượng</th>
          <th>Thành tiền</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}
