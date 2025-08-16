### 1 `GET /api/v1/products-category`  
**Mô tả:**  
API lấy danh sách danh mục sản phẩm. Yêu cầu quyền `products_category_view`.

**Query Params (tùy chọn):**  
```typescript
{
  sortKey?: string,  // Trường sắp xếp
  sortType?: string  // asc hoặc desc
}
```

**Response:**  
- Không có quyền:  
```typescript
{
  code: 403,
  message: "Bạn không có quyền xem danh mục sản phẩm!"
}
```
- Thành công:  
```typescript
{
  code: 200,
  productsCategory: []
}
```
- Lỗi server:  
```typescript
{
  code: 500,
  message: "Đã xảy ra lỗi khi lấy danh mục sản phẩm!"
}
```

---

### 2 `POST /api/v1/products-category/create`  
**Mô tả:**  
API tạo mới danh mục sản phẩm. Yêu cầu quyền `products_category_create`.

**Query Body:**  
```typescript
{
  title: string,
  description: string,
  status: string,
  position?: number,
  thumbnail: string,
  parent_id?: string
}
```

**Response:**  
- Không có quyền:  
```typescript
{
  code: 403,
  message: "Bạn không có quyền tạo danh mục sản phẩm!"
}
```
- Thành công:  
```typescript
{
  code: 200,
  message: "Thêm mới thành công!",
  productsCategory: {}
}
```
- Thất bại:  
```typescript
{
  code: 400,
  message: "Thêm mới không thành công!"
}
```

---

### 3 `PATCH /api/v1/products-category/edit/:id`  
**Mô tả:**  
API chỉnh sửa danh mục sản phẩm. Yêu cầu quyền `products_category_edit`.

**Query Params:**  
```typescript
{
  id: string
}
```

**Query Body:**  
```typescript
{
  title?: string,
  description?: string,
  position?: number,
  status?: string,
  thumbnail?: string
}
```

**Response:**  
- Không có quyền:  
```typescript
{
  code: 403,
  message: "Bạn không có quyền tạo danh mục sản phẩm!"
}
```
- Thành công:  
```typescript
{
  code: 200,
  message: "Chỉnh sửa thành công!"
}
```
- Không tồn tại:  
```typescript
{
  code: 400,
  message: "Không tồn tại danh mục này!"
}
```
- Thất bại:  
```typescript
{
  code: 400,
  message: "Chỉnh sửa không thành công!"
}
```

---

### 4 `DELETE /api/v1/products-category/delete-item/:id`  
**Mô tả:**  
API xóa danh mục sản phẩm. Yêu cầu quyền `products_category_del`.

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
- Thành công:  
```typescript
{
  code: 200,
  message: "Xóa thành công"
}
```
- Không tồn tại:  
```typescript
{
  code: 400,
  message: "Không tồn tại danh mục này!"
}
```

---

### 5 `GET /api/v1/products-category/change-status/:status/:id`  
**Mô tả:**  
API thay đổi trạng thái danh mục sản phẩm. Yêu cầu quyền `products_category_edit`.

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
- Thành công:  
```typescript
{
  code: 200,
  message: "Cập nhập trạng thái thành công"
}
```
- Không tồn tại:  
```typescript
{
  code: 400,
  message: "Không tồn tại"
}
```
