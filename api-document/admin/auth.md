### `GET /auth/login`
**Mô tả:**  
API dùng để đăng nhập, nhận về kết quả là một chuỗi token

**Request Body:**
```typescript
req.body {
  email: "",
  password: ""
}
```

**Response:**  
- Thất bại: 
```typescript
{
  code: 400,
  message: "Email không tồn tại!"
},
{
  code: 400,
  message: "Sai mật khẩu!"
},
{
  code: 400,
  message: "Tài khoản đã bị khóa!"
}
```
- Thành công
```typescript
{
  code: 200,
  message: "Đăng nhập thành công",
  token: "",
  id: "",
  fullName: "",
  email: "",
  permissions: []
}
```
---