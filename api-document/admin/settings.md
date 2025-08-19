### 1 `GET /api/v1/settings/general`  
**Mô tả:**  
Lấy ra thông tin của trang web.

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
  message: "Trang cài đặt chung",
  setting: {setting}
}
```
---

### 2 `PATCH /api/v1/settings/general`  
**Mô tả:**  
Cập nhật thông tin trang web, đăng nhập với quyền `settings_general`.

**Query Body:**  
```typescript
{
  websiteName?: string,
  logo: number,     
  phone: number, 
  address: string,
  copyright: string, 
  facebook?: string  
  instagram?: string 
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
  message: "Cập nhật thành công"
}
```
---