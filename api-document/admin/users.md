## 1. Lấy danh sách Users  
### `GET /api/v1/admin/users`  
**Mô tả:** Lấy danh sách tất cả người dùng (không bao gồm password và token).  

**Response thành công:**  
```json
{
  "code": 200,
  "message": "Trang tài khoản người dùng",
  "records": [
    {
      "_id": "66eaec459873bd1d90f4ad1e",
      "fullName": "Duong Tan Hoa",
      "email": "adrianbesriven@gmail.com",
      "phone": "0799435534",
      "status": "active",
      "avatar": "https://res.cloudinary.com/...jpg",
      "address": "k20/10a Phạm Văn Nghị, Thạc Gián, Thanh Khê, Đà Nẵng",
      "deleted": false,
      "createdAt": "2024-09-18T15:05:41.337Z",
      "updatedAt": "2025-06-29T15:07:42.046Z"
    }
  ]
}
```

**Response lỗi (không có quyền):**  
```json
{
  "code": 403,
  "message": "Bạn không có quyền truy cập"
}
```

---

## 2. Thay đổi trạng thái User  
### `GET /api/v1/admin/users/change-status/:status/:id`  
**Mô tả:** Thay đổi trạng thái user (`active` / `inactive`).  

**Response thành công:**  
```json
{
  "code": 200,
  "message": "Thay đổi trạng thái thành công"
}
```

**Response lỗi:**  
```json
{
  "code": 403,
  "message": "Bạn không có quyền truy cập"
}
```

---

## 3. Xóa User  
### `DELETE /api/v1/admin/users/delete/:idUser`  
**Mô tả:** Xóa mềm một user (set `deleted = true`).  

**Response thành công:**  
```json
{
  "code": 200,
  "message": "Xóa tài khoản thành công"
}
```

**Response lỗi (không tìm thấy user):**  
```json
{
  "code": 400,
  "message": "Không tồn tại user!"
}
```

---

## 4. Chi tiết User  
### `GET /api/v1/admin/users/detail/:idUser`  
**Mô tả:** Lấy chi tiết thông tin user theo `id`.  

**Response thành công:**  
```json
{
  "code": 200,
  "message": "Chi tiết tài khoản",
  "user": {
    "_id": "66eaec459873bd1d90f4ad1e",
    "fullName": "Duong Tan Hoa",
    "email": "adrianbesriven@gmail.com",
    "phone": "0799435534",
    "status": "active",
    "avatar": "https://res.cloudinary.com/...jpg",
    "address": "k20/10a Phạm Văn Nghị, Thạc Gián, Thanh Khê, Đà Nẵng",
    "deleted": false,
    "createdAt": "2024-09-18T15:05:41.337Z",
    "updatedAt": "2025-06-29T15:07:42.046Z"
  }
}
```

**Response lỗi (không có quyền):**  
```json
{
  "code": 403,
  "message": "Bạn không có quyền truy cập"
}
```
