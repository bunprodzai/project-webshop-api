API DOCUMENTS
---

## 📌 CLient

### 1. Home
| Method  | Endpoint | Mô tả                              |
| ------- | -------- | ---------------------------------- |
| **GET** | `/`      | Lấy ra các thông tin của trang chủ |

### 2. Articles
| Method  | Endpoint                 | Mô tả                  |
| ------- | ------------------------ | ---------------------- |
| **GET** | `/articles/`             | Lấy danh sách bài viết |
| **GET** | `/articles/detail/:slug` | Lấy chi tiết bài viết  |

### `GET /articles/`
**Mô tả:**  
...

---

### 3. Banners
| Method  | Endpoint                       | Mô tả                                |
| ------- | ------------------------------ | ------------------------------------ |
| **GET** | `/banners/`                    | Lấy danh sách quảng cáo              |
| **GET** | `/banners/detail/:slug`        | Lấy chi tiết quảng cáo               |
| **GET** | `/banners/vouchers/:banner_id` | Lấy Danh sách voucher theo quảng cáo |

### 4. Cart
| Method    | Endpoint                       | Mô tả                             |
| --------- | ------------------------------ | --------------------------------- |
| **GET**   | `/cart/get-cart/:cartId`       | Lấy giỏ hàng theo ID              |
| **PATCH** | `/cart/delete/:idProduct`      | Xoá sản phẩm khỏi giỏ hàng        |
| **PATCH** | `/cart/update/:idProduct`      | Cập nhật sản phẩm trong giỏ hàng  |
| **PATCH** | `/cart/add/:productId`         | Thêm sản phẩm vào giỏ hàng        |
| **GET**   | `/cart/create`                 | Tạo giỏ hàng mới                  |
| **PATCH** | `/cart/update-user/:tokenUser` | Cập nhật giỏ hàng theo người dùng |
| **GET**   | `/cart/find/:tokenUser`        | Tìm giỏ hàng theo người dùng      |

### 5. Products
| Method  | Endpoint                  | Mô tả                      |
| ------- | ------------------------- | -------------------------- |
| **GET** | `/products/`              | Lấy danh sách sản phẩm     |
| **GET** | `/products/:slugCategory` | Lấy sản phẩm theo danh mục |
| **GET** | `/products/detail/:slug`  | Lấy chi tiết sản phẩm      |

### 6. Search
| Method  | Endpoint   | Mô tả                      |
| ------- | ---------- | -------------------------- |
| **GET** | `/search/` | Tìm kiếm sản phẩm theo tên |

### 7. Settings
| Method  | Endpoint     | Mô tả                                 |
| ------- | ------------ | ------------------------------------- |
| **GET** | `/settings/` | Lấy thông tin cài đặt chung trang web |


### 8. Checkout
| Method    | Endpoint                       | Mô tả                           |
| --------- | ------------------------------ | ------------------------------- |
| **GET**   | `/checkout/order/detail/:code` | Lấy chi tiết đơn hàng           |
| **POST**  | `/checkout/order`              | Tạo đơn hàng                    |
| **PATCH** | `/checkout/success/:orderId`   | Xác nhận đơn hàng thành công    |
| **GET**   | `/checkout/history/:tokenUser` | Lịch sử đơn hàng của người dùng |

### 9. Products-Category
| Method  | Endpoint             | Mô tả              |
| ------- | -------------------- | ------------------ |
| **GET** | `/products-category` | Danh sách danh mục |

### 10. Chat bot
| Method   | Endpoint   | Mô tả                         |
| -------- | ---------- | ----------------------------- |
| **POST** | `/chatbot` | Chat bot AI hỗ trợ khách hàng |

### 11. Users
| Method    | Endpoint                         | Mô tả                                                       |
| --------- | -------------------------------- | ----------------------------------------------------------- |
| **POST**  | `/users/register`                | Đăng ký tài khoản khách hàng                                |
| **POST**  | `/users/login`                   | Đăng nhập                                                   |
| **POST**  | `/users/password/forgot`         | Quên mật khẩu, tìm kiếm xác nhận email và gửi OTP qua email |
| **POST**  | `/users/password/otp/:email`     | Nhập mã OTP                                                 |
| **POST**  | `/users/password/reset-password` | Đổi mật khẩu mới                                            |
| **GET**   | `/users/info`                    | Lấy thông tin cá nhân                                       |
| **PATCH** | `/users/info/edit`               | Cập nhật thông tin cá nhân                                  |
| **PATCH** | `/users/info/reset-password`     | Thay đổi mật khẩu                                           |
| **GET**   | `/users/history-order`           | Lấy thông tin lịch sử đơn hàng theo id                      |

### 12. VN-Payment
| Method   | Endpoint                      | Mô tả                         |
| -------- | ----------------------------- | ----------------------------- |
| **POST** | `/vn-pay/create-qr`           | Tạo ra thông tin thanh toán   |
| **get**  | `/vn-pay/check-payment-vnpay` | Xác nhận thông tin thanh toán |

---

## 📌 Admin || '/api/v1/admin'

### 1. Auth 
| Method   | Endpoint      | Mô tả     |
| -------- | ------------- | --------- |
| **POST** | `/auth/login` | Đăng nhập |

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

### 2. Products
| Method     | Endpoint                              | Mô tả                                            |
| ---------- | ------------------------------------- | ------------------------------------------------ |
| **GET**    | `/products`                           | Lấy danh sách sản phẩm, gửi kèm các query để lọc |
| **GET**    | `/products/change-status/:status/:id` | Thay đổi trạng thái sản phẩm theo id             |
| **DELETE** | `/products/delete-item/:id`           | Xóa sản phẩm theo id                             |
| **POST**   | `/products/create-item`               | Thêm mới sản phẩm                                |
| **PATCH**  | `/products/edit-item/:id`             | Chỉnh sửa sản phẩm theo id                       |
| **GET**    | `/products/detail/:id`                | Chi tiết sản phẩm theo id                        |

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
  stock: number,
  status: string,
  position?: number,
  thumbnail: string,
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
  stock: number,
  status: string,
  position?: number,
  thumbnail: string,
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

### 3. Products-Category
| Method     | Endpoint                                       | Mô tả                                            |
| ---------- | ---------------------------------------------- | ------------------------------------------------ |
| **GET**    | `/products-category`                           | Lấy danh sách danh mục, gửi kèm các query để lọc |
| **GET**    | `/products-category/change-status/:status/:id` | Thay đổi trạng thái danh mục theo id             |
| **DELETE** | `/products-category/delete-item/:id`           | Xóa danh mục theo id                             |
| **POST**   | `/products-category/create`                    | Thêm mới danh mục                                |
| **PATCH**  | `/products-category/edit/:id`                  | Chỉnh sửa danh mục theo id                       |

### 3. Role
| Method     | Endpoint                 | Mô tả                             |
| ---------- | ------------------------ | --------------------------------- |
| **GET**    | `/roles`                 | Lấy danh sách quyền               |
| **POST**   | `/roles/create`          | Tạo ra một quyền mới              |
| **GET**    | `/roles/detail/:id`      | Chi tiết quyền theo id            |
| **PATCH**  | `/roles/edit/:id`        | Chỉnh sửa thông tin quyền theo id |
| **PATCH**  | `/roles/permissions`     | Cập nhật quyền hạn của quyền      |
| **DELETE** | `/roles/delete-item/:id` | Xóa quyền theo id                 |

### 4. Accounts
| Method     | Endpoint                              | Mô tả                                   |
| ---------- | ------------------------------------- | --------------------------------------- |
| **GET**    | `/accounts`                           | Lấy danh sách tài khoản nhân viên       |
| **POST**   | `/accounts/create`                    | Tạo ra một tài khoản nhân viên mới      |
| **PATCH**  | `/accounts/edit/:id`                  | Chỉnh sửa tài khoản nhân viên theo id   |
| **GET**    | `/accounts/change-status/:status/:id` | Thay đổi trạng thái tài khoản nhân viên |
| **DELETE** | `/accounts/delete/:id`                | Xóa tài khoản nhân viên theo id         |

### 5. Dashboard
| Method  | Endpoint                                  | Mô tả                                                      |
| ------- | ----------------------------------------- | ---------------------------------------------------------- |
| **GET** | `/dashboard`                              |                                                            |
| **GET** | `/dashboard/timestart`                    | Lấy thời gian bắt đầu thống kê                             |
| **GET** | `/dashboard/product/percentGrowth/:time`  | Lấy phần trăm tăng trưởng sản phẩm theo thời gian          |
| **GET** | `/dashboard/order/percentGrowth/:time`    | Lấy phần trăm tăng trưởng đơn hàng theo thời gian          |
| **GET** | `/dashboard/user/percentGrowth/:time`     | Lấy phần trăm tăng trưởng người dùng theo thời gian        |
| **GET** | `/dashboard/category/percentGrowth/:time` | Lấy phần trăm tăng trưởng danh mục sản phẩm theo thời gian |
| **GET** | `/dashboard/latest-revenue`               | Lấy doanh thu mới nhất                                     |
| **GET** | `/dashboard/recent-orders`                | Lấy danh sách đơn hàng gần đây                             |
| **GET** | `/dashboard/top-selling-category/:time`   | Lấy danh mục bán chạy nhất theo thời gian                  |
| **GET** | `/dashboard/top-selling-product/:time`    | Lấy sản phẩm bán chạy nhất theo thời gian                  |
| **GET** | `/dashboard/low-stock-products`           | Lấy danh sách sản phẩm sắp hết hàng                        |


### 6. My-account
| Method    | Endpoint          | Mô tả                         |
| --------- | ----------------- | ----------------------------- |
| **GET**   | `/`               | Lấy thông tin tài khoản       |
| **PATCH** | `/edit`           | Chỉnh sửa thông tin tài khoản |
| **PATCH** | `/reset-password` | Đặt lại mật khẩu tài khoản    |

### 7. Settings
| Method    | Endpoint   | Mô tả                            |
| --------- | ---------- | -------------------------------- |
| **GET**   | `/general` | Lấy thông tin cài đặt chung      |
| **PATCH** | `/general` | Cập nhật thông tin cài đặt chung |

### 8. Users
| Method     | Endpoint                     | Mô tả                                     |
| ---------- | ---------------------------- | ----------------------------------------- |
| **GET**    | `/`                          | Lấy danh sách người dùng                  |
| **GET**    | `/change-status/:status/:id` | Thay đổi trạng thái người dùng            |
| **DELETE** | `/delete/:idUser`            | Xóa người dùng theo ID                    |
| **GET**    | `/detail/:idUser`            | Lấy thông tin chi tiết người dùng theo ID |

### 9. Orders
| Method  | Endpoint                       | Mô tả                                    |
| ------- | ------------------------------ | ---------------------------------------- |
| **GET** | `/`                            | Lấy danh sách đơn hàng                   |
| **GET** | `/detail/:id`                  | Lấy thông tin chi tiết đơn hàng theo ID  |
| **GET** | `/change-status/:status/:code` | Thay đổi trạng thái đơn hàng theo mã đơn |

### 9. Articles
| Method     | Endpoint      | Mô tả                                   |
| ---------- | ------------- | --------------------------------------- |
| **GET**    | `/`           | Lấy danh sách sản phẩm                  |
| **POST**   | `/create`     | Tạo sản phẩm mới                        |
| **PATCH**  | `/edit/:id`   | Chỉnh sửa thông tin sản phẩm theo ID    |
| **DELETE** | `/delete/:id` | Xóa sản phẩm theo ID                    |
| **GET**    | `/detail/:id` | Lấy thông tin chi tiết sản phẩm theo ID |

### 10. Banners
| Method     | Endpoint                     | Mô tả                         |
| ---------- | ---------------------------- | ----------------------------- |
| **GET**    | `/`                          | Lấy danh sách quảng cáo       |
| **POST**   | `/create`                    | Tạo quảng cáo mới             |
| **PATCH**  | `/edit/:id`                  | Chỉnh sửa quảng cáo theo ID   |
| **GET**    | `/change-status/:status/:id` | Thay đổi trạng thái quảng cáo |
| **DELETE** | `/delete/:id`                | Xóa quảng cáo theo ID         |

### 11. Vouchers
| Method     | Endpoint                     | Mô tả                       |
| ---------- | ---------------------------- | --------------------------- |
| **GET**    | `/`                          | Lấy danh sách voucher       |
| **POST**   | `/create`                    | Tạo voucher mới             |
| **PATCH**  | `/edit/:id`                  | Chỉnh sửa voucher theo ID   |
| **GET**    | `/change-status/:status/:id` | Thay đổi trạng thái voucher |
| **DELETE** | `/delete/:id`                | Xóa voucher theo ID         |

