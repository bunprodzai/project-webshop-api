### 1 `GET /api/v1/orders`  
**Mô tả:**  
API dùng để lấy danh sách sản phẩm với lọc, phân trang, tìm kiếm, sắp xếp. Yêu cầu quyền `orders_view`.

**Response:**  
- Không có quyền: 
```typescript
{
  code: 403,
  message: "Bạn không có quyền truy cập"
}
```
- Thành công
```typescript
{
  code: 200,
  message: "Quản lý đơn hàng",
  records: [records],
  sales: [sales] // tổng doanh thu đơn hàng
}
```
---

### 2 `GET /api/v1/orders/detail/:id`  
**Mô tả:**  
API dùng để lấy danh sách sản phẩm với lọc, phân trang, tìm kiếm, sắp xếp. Yêu cầu quyền `products_view`.

**Query Params:**  
```typescript
{
  id?: string
}
```

**Response:**  
- Không có quyền: 
```typescript 
{
  code: 403,
  message: "Bạn không có quyền xem sản phẩm!"
}
```
- Thành công
```typescript
{
  code: 200,
  message: "Chi tiết đơn hàng",
  record: {record}
}
```
---

### 3 `GET /api/v1/orders/change-status/:status/:code`  
**Mô tả:**  
API dùng để lấy danh sách sản phẩm với lọc, phân trang, tìm kiếm, sắp xếp. Yêu cầu quyền `products_view`.

**Query Params:**  
```typescript
{
  code?: string,
  status?: number
}
```

**Response:**  
- Không có quyền: 
```typescript
{
  code: 403,
  message: "Bạn không có quyền xem sản phẩm!"
}
```
- Thành công
```typescript
{
  code: 200,
  products: [],
  totalPage: number
}
```
---