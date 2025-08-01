# 💼 demo - project-webshop Frontend

Built RESTful API with clean MVC architecture. 
#### Focused on implementing authentication and authorization mechanisms to secure sensitive resources and user data, allowing different user roles (Admin, Manager, User, Guest, etc.) to access resources according to their permissions.
- User management, detailed authorization (RBAC)
- API CRUD operations for managing data entities, allowing users to create, read, update, - and delete resources.
- Integrate online payment with VNPay.
- JWT-based Authentication & Secure Authorization
- Audit Logs to track user activities, including creating, updating, or deleting resources for better monitoring and security.
- Integrate messaging dialog box to support automatic consultation with AI.
## 🔧 Technologies Used
- Framework: Express.js 
- Database: MongoDB (Mongoose and plugin Mongoose Slug Updater).
- Middleware: Body Parser, Cookie Parser, CORS, Express Session.
- Environmental Management: Dotenv.
- Utilities: Nodemailer, MD5, VNPay, JWT, OpenAI.

## 📂 Project Structure
```
bash project-BE-webshop/api/v1
├── controllers/ 
├── middlewares/ 
├── models/ 
├── routes/ 
├── services/ 
├── utils/ 
├── validates/ 
├── config/ 
├── helpers/ 
├── .env 
├── .gitignore 
├── index.js 
└── README.md 
```
## Main functionalities included

#### 🧑‍💼 Authentication and Authorization
- ✅ Register / Login via Email + Password.
- ✅ Email Verification via email (OTP).
- ✅ RBAC with Role, Permissions (Standard Intermediary Table).

#### 📄 Website management
 - CRUD products, categories, posts, ads, vouchers, orders, customers, employees, general settings and permissions.

#### 🔍 Advanced Search
- Search by keyword.
- Filter by category, gender.
- Sort by price, desc or asc.

#### 🔍 Clients
- Manage shopping cart
- Product reviews
- Order, pay online with VNPay
- Search, filter products

## Database Diagram
![Logo](https://res.cloudinary.com/djckm3ust/image/upload/v1753840714/z6854738666946_371823684f476e408784c6cf7ab35f63_h1kklx.jpg)


## Run Locally

Clone the project

```bash
  git clone https://github.com/bunprodzai/project-webshop-api
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```


## 🚀 About Me
I'm a MERN Stack Developer

- Tác giả: [Dương Tấn Hòa](https://www.facebook.com/bunsdzpro)
- GitHub: [@bunprodzai](https://github.com/bunprodzai)
- Sinh viên năm 3 – Trường Đại học Duy Tân
- Backend: NodeJs + ExpressJs | Frontend: ReactJs