### 1 `GET /api/v1/products`  
**Mô tả:**  
API dùng để lấy danh sách sản phẩm với lọc, phân trang, tìm kiếm, sắp xếp. Yêu cầu quyền `products_view`.

**Query Params:**  
```typescript
{
  status?: string,        // Lọc theo trạng thái
  limit?: number,         // Số lượng/trang
  page?: number,          // Trang hiện tại
  keyword?: string,       // Tìm kiếm theo tên
  sortKey?: string,       // Trường sắp xếp (vd: price)
  sortType?: string       // asc hoặc desc
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

### 2 `POST /api/v1/products/create-item`  
**Mô tả:**  
API tạo mới sản phẩm. Yêu cầu quyền `products_create`.

**Query Body:**  
```typescript
{
  title: string,
  description: string,
  price: number,
  discountPercentage: number,
  status: string,
  position?: number,
  sex: string
  thumbnail: string,
  images: string[],
  featured: string,
  product_category_id?: string,
  sizeStock?: string[] // Ví dụ: ["S-10", "M-5"]
}
```

**Response:**  
- Không có quyền: 
```typescript
{
  code: 403,
  message: "Bạn không có quyền tạo sản phẩm!"
}
```
- Thành công
```typescript
{
  code: 200,
  message: "Tạo mới thành công",
  data: {}
}
```
- Thất bại
```typescript
{
  code: 400,
  message: "Tạo mới sản phẩm không thành công! - {error}"
}
```
---

### 3 `GET /api/v1/products/change-status/:status/:id`  
**Mô tả:**  
API thay đổi trạng thái sản phẩm. Yêu cầu quyền `products_edit`.

**Query Params:**  
```typescript
{
  status: string, // active | inactive
  id: string
}
```

**Response:**  
- Không có quyền: 
```typescript
{
  code: 403,
  message: "Bạn không có quyền chỉnh sửa sản phẩm!"
}
```
- Thành công
```typescript
{
  code: 200,
  message: "Cập nhập trạng thái thành công"
}
```
- Lỗi
```typescript
{
  code: 400,
  message: "Không tồn tại"
}
```
---

### 4 `PATCH /api/v1/products/edit-item/:id`  
**Mô tả:**  
API chỉnh sửa sản phẩm. Yêu cầu quyền `products_edit`.

**Query Params:**  
```typescript
{
  id: string
}
```

**Query Body:**  
```typescript
{
  title: string,
  description: string,
  price: number,
  discountPercentage: number,
  status: string,
  position?: number,
  sex: string
  thumbnail: string,
  images: string[],
  featured: string,
  product_category_id?: string,
  sizeStock?: string[] // Ví dụ: ["S-10", "M-5"]
}
```

**Response:**  
- Không có quyền: 
```typescript
{
  code: 403,
  message: "Bạn không có quyền chỉnh sửa sản phẩm!"
}
```
- Thành công
```typescript
{
  code: 200,
  message: "Chỉnh sửa thành công"
}
```
- Lỗi
```typescript
{
  code: 400,
  message: "Không tồn tại"
}
```
---

### 5 `DELETE /api/v1/products/delete-item/:id`  
**Mô tả:**  
API xóa sản phẩm. Yêu cầu quyền `products_del`.

**Query Params:**  
```typescript
{
  id: string
}
```

**Response:**  
- Không có quyền: 
```typescript
{
  code: 403,
  message: "Bạn không có quyền xóa sản phẩm!"
}
```
- Thành công
```typescript
{
  code: 403,
  message: "Bạn không có quyền xóa sản phẩm!"
}
```
- Lỗi
```typescript
{
  code: 400,
  message: "Không tồn tại"
}
```
---

### 6 `GET /api/v1/admin/products/detail/:id`  
**Mô tả:**  
API lấy chi tiết sản phẩm. Yêu cầu quyền `products_view`.

**Query Params:**  
```typescript
{
  id: string
}
```

**Response:**  
- Không có quyền: 
```typescript
{
  code: 403,
  message: "Bạn không có quyền này!"
}
```
- Thành công
```typescript
{
  code: 200,
  message: "Lấy chi tiết sản phẩm thành công",
  product: {}
}
```
- Lỗi
```typescript
{
  code: 400,
  message: "Lỗi params"
}
```
---