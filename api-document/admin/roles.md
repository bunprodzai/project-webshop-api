### 1 `GET /api/v1/roles`  
**Mô tả:**  
Lấy danh sách quyền. Yêu cầu quyền `roles_view`.

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền xem danh sách quyền!"
}
```
- Thành công:
```typescript
{
  code: 200,
  roles: []
}
```

---

### 2 `POST /api/v1/roles/create`  
**Mô tả:**  
Tạo mới quyền. Yêu cầu quyền `roles_create`.

**Query Body:**
```typescript
{
  title: string,
  description: string,
  permissions: string[]
}
```

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền tạo phân quyền!"
}
```
- Thành công:
```typescript
{
  code: 200,
  message: "Thêm mới thành công",
  role: {}
}
```

---

### 3 `PATCH /api/v1/roles/edit/:id`  
**Mô tả:**  
Chỉnh sửa quyền. Yêu cầu quyền `roles_edit`.

**Query Params:**
```typescript
id: string
```

**Query Body:**
```typescript
{
  title?: string,
  description?: string,
  permissions?: string[]
}
```

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền chỉnh sửa phân quyền!"
}
```
- Thành công:
```typescript
{
  code: 200,
  message: "Chỉnh sửa thành công"
}
```
- Thất bại:
```typescript
{
  code: 400,
  message: "Chỉnh sửa không thành công"
}
```

---

### 4 `PATCH /api/v1/roles/permissions`  
**Mô tả:**  
Cập nhật phân quyền cho nhiều role. Yêu cầu quyền `roles_permissions`.

**Query Body:**
```typescript
{
  permissions: [
    {
      id: string,
      permissions: string[]
    }
  ]
}
```

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền cập nhập phân quyền!"
}
```
- Thành công:
```typescript
{
  code: 200,
  message: "Cập nhập phân quyền thành công",
  records: []
}
```
- Thất bại:
```typescript
{
  code: 400,
  message: "Cập nhập phân quyền không thành công!"
}
```

---

### 5 `DELETE /api/v1/roles/delete-item/:id`  
**Mô tả:**  
Xóa quyền. Yêu cầu quyền `roles_del`.

**Query Params:**
```typescript
id: string
```

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền xóa nhóm quyền!"
}
```
- Thành công:
```typescript
{
  code: 200,
  message: "Xóa nhóm quyền thành công"
}
```
- Thất bại:
```typescript
{
  code: 400,
  message: "Không tồn tại nhóm quyền này!"
}
```

---

### 6 `GET /api/v1/roles/detail/:id`  
**Mô tả:**  
Lấy chi tiết quyền. Yêu cầu quyền `roles_view`.

**Query Params:**
```typescript
id: string
```

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền này"
}
```
- Thành công:
```typescript
{
  code: 200,
  message: "Chi tiết quyền",
  role: {}
}
```
- Thất bại:
```typescript
{
  code: 400,
  message: "Lỗi params"
}
```
