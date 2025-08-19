### 1 `GET /api/v1/my-account`  
**Mô tả:**  
Lấy thông tin tài khoản cá nhân, không có password.

**Response:**  
- Thành công:
```typescript
{
    code: 200,
    message: "Thông tin cá nhân",
    myAccount: {myAccount}
  }
```


---

### 2 `PATCH /api/v1/my-account/edit`  
**Mô tả:**  
Cập nhật thông tin cá nhân

**Response:**  
- Thành công:
```typescript
{
  code: 200,
  message: "Cập nhật thành công"
}
```
- Thất bại:
```typescript
{
  code: 401,
  message: "Email đã tồn tại"
}
{
  code: 400,
  message: "Lỗi"
}
```

---

### 2 `PATCH /api/v1/my-account/reset-password`  
**Mô tả:**  
Đổi mật khẩu tài khoản cá nhân

**Query Body:**
```typescript
{
  passwordOld?: string,
  passwordNew?: string,
  passwordNewComfirm?: string[]
}
```

**Response:**  
- Thành công:
```typescript
{
  code: 200,
  message: "Đổi mật khẩu thành công!"
}
```
- Thất bại:
```typescript
{
  code: 401,
  message: "Không tìm thấy account!"
}
{
  code: 204,
  message: "Mật khẩu không đúng!"
}      
{
  code: 204,
  message: "Mật khẩu mới không khớp nhau!"
}
{
  code: 400,
  message: "Lỗi"
}
```
---