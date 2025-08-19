### 1 `GET /api/v1/accounts`  
**Mô tả:**  
Lấy danh sách tài khoản. Yêu cầu quyền `accounts_view`.

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền xem danh sách danh sách tài khoản!"
}
```
- Thành công:
```typescript
{
  code: 200,
  accounts: []
}
```
- Thất bại:
```typescript
{
  code: 400,
  message: "Lỗi!"
}
```

---

### 2 `POST /api/v1/accounts/create`  
**Mô tả:**  
Tạo mới tài khoản. Yêu cầu quyền `accounts_create`.

**Query Body:**
```typescript
{
  fullName: string,
  email: string,
  password: string,
  phone: string,
  role_id: string,
  status: string
}
```

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền tạo tài khoản!"
}
```
- Email tồn tại:
```typescript
{
  code: 400,
  message: "Email đã tồn tại!"
}
```
- Thành công:
```typescript
{
  code: 200,
  message: "Thêm mới thành công"
}
```

---

### 3 `PATCH /api/v1/accounts/edit/:id`  
**Mô tả:**  
Chỉnh sửa tài khoản. Yêu cầu quyền `accounts_edit`.

**Query Params:**
```typescript
id: string
```

**Query Body:**
```typescript
{
  fullName?: string,
  email?: string,
  password?: string,
  phone?: string,
  role_id?: string,
  status?: string
}
```

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền cập nhập thông tin tài khoản!"
}
```
- Email tồn tại:
```typescript
{
  code: 409,
  message: "Email đã tồn tại"
}
```
- Thành công:
```typescript
{
  code: 200,
  message: "Cập nhập thành công"
}
```
- Thất bại:
```typescript
{
  code: 400,
  message: "Cập nhập thất bại!"
}
```

---

### 4 `GET /admin/accounts/change-status/:status/:id`  
**Mô tả:**  
Thay đổi trạng thái tài khoản. Yêu cầu quyền `accounts_edit`.

**Query Params:**
```typescript
status: string,
id: string
```

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền truy cập!"
}
```
- Thành công:
```typescript
{
  code: 200,
  message: "Thay đổi trạng thái thành công"
}
```
- Thất bại:
```typescript
{
  code: 400,
  message: "Thay đổi trạng thái không thành công!"
}
```

---

### 5 `DELETE /admin/accounts/delete/:id`  
**Mô tả:**  
Xóa tài khoản. Yêu cầu quyền `accounts_del`.

**Query Params:**
```typescript
id: string
```

**Response:**  
- Không có quyền:
```typescript
{
  code: 403,
  message: "Bạn không có quyền xóa tài khoản!"
}
```
- Thành công:
```typescript
{
  code: 200,
  message: "Xóa thành công"
}
```
- Thất bại:
```typescript
{
  code: 400,
  message: "Xóa không thành công!"
}
```
