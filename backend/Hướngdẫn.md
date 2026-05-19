<!-- ### Cách xem file .md đẹp trên VS Code: -->
<!-- 1.  Tạo file `README.md` và dán nội dung trên vào. -->
<!-- 2.  Mở file đó ra. -->
<!-- 3.  Ấn tổ hợp phím **Ctrl + Shift + V** (trên Windows) hoặc **Cmd + Shift + V** (trên Mac) để xem chế độ Preview đẹp mắt. -->

<!-- Các mục config, models, .env để sau này kết nối với database." -->

# HỆ THỐNG TUYỂN DỤNG VIỆC LÀM (API BACKEND)

**Phiên bản:** 1.0.0  
**Công nghệ:** Node.js, ExpressJS, JWT (JsonWebToken)

---

## 1. TỔNG QUAN HỆ THỐNG
Hệ thống là một Backend Server cung cấp các API RESTful phục vụ cho nền tảng tuyển dụng, kết nối giữa **Nhà tuyển dụng (Company)** và **Sinh viên (Student)**. Hệ thống quản lý việc đăng nhập, đăng tin tuyển dụng và nộp hồ sơ ứng tuyển.

### Các Actor (Vai trò)
1.  **Guest (Khách vãng lai):** Có thể xem danh sách việc làm công khai.
2.  **Student (Sinh viên):** Có thể xem việc làm, xem profile cá nhân, nộp đơn ứng tuyển (Apply).
3.  **Company (Nhà tuyển dụng):** Có thể đăng tin tuyển dụng mới, xem và duyệt hồ sơ ứng viên.

---

## 2. CƠ SỞ DỮ LIỆU (MOCK DATA MODEL)
*Hệ thống hiện tại sử dụng dữ liệu giả lập lưu trong bộ nhớ (RAM).*

### 2.1. User (Người dùng)
| Trường | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | Int | Khóa chính |
| `name` | String | Tên công ty hoặc tên sinh viên |
| `email` | String | Tên đăng nhập (Unique) |
| `password` | String | Mã hóa Bcrypt |
| `role` | String | "company" hoặc "student" |

### 2.2. Job (Tin tuyển dụng)
| Trường | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `id` | Int | Khóa chính |
| `title` | String | Tiêu đề công việc |
| `company_id` | Int | ID của công ty đăng tuyển |
| `location` | String | Địa điểm làm việc |
| `salary` | String | Mức lương |
| `type` | String | Loại hình (Full-time/Intern) |
| `description` | String | Mô tả chi tiết |
| `created_at` | Date | Ngày tạo |

### 2.3. ApplyJob (Đơn ứng tuyển)
| Trường | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `job_id` | Int | ID công việc |
| `student_id` | Int | ID sinh viên ứng tuyển |
| `status` | String | Trạng thái ("pending", "accepted", "rejected") |

---

## 3. DANH SÁCH API (API SPECIFICATION)

### 3.1. Authentication (Xác thực)

| Method | Endpoint | Mô tả | Yêu cầu (Body/Auth) |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Đăng nhập hệ thống | Body: `{ email, password }` |
| `GET` | `/api/auth/profile/:id` | Xem thông tin cá nhân | **Auth**: Bearer Token |

### 3.2. Jobs (Quản lý việc làm)

| Method | Endpoint | Mô tả | Yêu cầu (Body/Auth) |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Lấy danh sách tất cả việc làm | Không yêu cầu |
| `GET` | `/api/jobs/:id` | Xem chi tiết 1 việc làm | Không yêu cầu |
| `POST` | `/api/jobs` | Tạo công việc mới (Company) | **Auth**: Token <br> Body: `{ title, salary... }` |

### 3.3. Application (Quản lý ứng tuyển)

| Method | Endpoint | Mô tả | Yêu cầu (Body/Auth) |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/jobs/apply` | Sinh viên nộp đơn | **Auth**: Token <br> Body: `{ job_id, student_id }` |
| `GET` | `/api/jobs/:id/applicants` | Xem danh sách người ứng tuyển | **Auth**: Token (Company only) |
| `PUT` | `/api/jobs/apply/status` | Cập nhật trạng thái đơn (Duyệt) | **Auth**: Token <br> Body: `{ job_id, student_id, status }` |

---

## 4. HƯỚNG DẪN KIỂM THỬ (TESTING FLOW)

### Bước 1: Đăng nhập (Login)
* **URL:** `POST http://localhost:3000/api/auth/login`
* **Body:**
    ```json
    {
      "email": "sv001@school.edu",
      "password": "123456"
    }
    ```
* **Kết quả:** Copy chuỗi `token` trả về.

### Bước 2: Setup Token
Trong Postman hoặc Client, thêm vào Header cho các request cần bảo mật:
`Authorization: Bearer <dán_token_vào_đây>`

### Bước 3: Test chức năng
1.  **Nộp đơn:** `POST /api/jobs/apply` với Body `{ "job_id": 1, "student_id": 2 }`.
2.  **Check Profile:** `GET /api/auth/profile/2` -> Sẽ thấy job vừa apply hiện ra.
3.  **Tạo Job (Role Company):** Login bằng tài khoản công ty, sau đó `POST /api/jobs`.

---

## 5. CẤU TRÚC THƯ MỤC SOURCE CODE

```text
PROJECT-ROOT/
├── controllers/       # Xử lý logic điều hướng (Req, Res)
│   ├── auth.controller.js
│   ├── job.controller.js
│   └── user.controller.js
├── data/              # Mock Data (Dữ liệu giả lập)
│   ├── users.data.js
│   ├── jobs.data.js
│   └── applyJobs.data.js
├── routes/            # Định nghĩa các đường dẫn API
│   ├── auth.route.js
│   └── job.route.js
├── services/          # Xử lý logic nghiệp vụ (Business Logic)
│   ├── auth.service.js
│   └── job.service.js
├── auth.middleware.js # Middleware xác thực Token
├── index.js           # File chạy chính (Server Entry point)
└── package.json       # Khai báo thư viện