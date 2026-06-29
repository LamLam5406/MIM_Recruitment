<!-- Ấn tổ hợp phím **Ctrl + Shift + V** (trên Windows) hoặc **Cmd + Shift + V** (trên Mac) để xem chế độ Preview. -->

---

# HỆ THỐNG TUYỂN DỤNG VIỆC LÀM

**Phiên bản:** 1.0.0

**Công nghệ:** Node.js, ExpressJS, PostgreSQL, Sequelize ORM, JWT (JsonWebToken)

---

## 1. TỔNG QUAN HỆ THỐNG

MIM Recruitment là nền tảng web toàn diện được thiết kế nhằm cầu nối trực tiếp giữa sinh viên và các doanh nghiệp có nhu cầu tuyển dụng. Hệ thống phân quyền chặt chẽ với 3 nhóm người dùng chính:

* **Quản trị viên (Admin):** Quản lý toàn bộ tài khoản (người dùng, doanh nghiệp), đăng tải và quản lý tin tức truyền thông trên trang chủ.
* **Doanh nghiệp (Company):** Cập nhật hồ sơ công ty (logo, website, lĩnh vực), đăng tin tuyển dụng, xem danh sách ứng viên, duyệt/loại hồ sơ và gửi email thư mời phỏng vấn trực tiếp từ hệ thống.
* **Sinh viên (Student):** Tạo hồ sơ cá nhân (GPA, kỹ năng, chuyên ngành), tải lên CV đính kèm, tìm kiếm việc làm theo bộ lọc và nộp đơn ứng tuyển.

---

## 2. KIẾN TRÚC & CÔNG NGHỆ SỬ DỤNG

Hệ thống được thiết kế theo mô hình client-server, sử dụng các công nghệ web hiện đại, đảm bảo hiệu năng và dễ dàng bảo trì:

### 2.1. Frontend

* **Core:** ReactJS kết hợp với công cụ đóng gói Vite cho tốc độ build nhanh và tối ưu dung lượng.
* **Định tuyến & Gọi API:** react-router-dom để điều hướng trang, axios để giao tiếp với Backend.
* **Trạng thái (State):** Sử dụng React Context API để quản lý phiên đăng nhập (AuthContext).

### 2.2. Backend

* **Core:** Node.js và ExpressJS cung cấp hệ thống RESTful API.
* **Cơ sở dữ liệu:** PostgreSQL (chạy trong môi trường Docker Container).
* **ORM:** Sequelize ORM giúp quản lý các model, thực hiện truy vấn an toàn (chống SQL Injection) và tự động đồng bộ cấu trúc bảng.
* **Bảo mật & Tiện ích:** * bcrypt mã hóa mật khẩu.
* jsonwebtoken (JWT) để xác thực và phân quyền người dùng.
* multer để xử lý upload file (Lưu trữ cục bộ trực tiếp trên server).
* nodemailer tích hợp SMTP của Gmail để gửi thư mời phỏng vấn tự động.



---

## 3. CƠ SỞ DỮ LIỆU (DATA MODELS)

Cấu trúc cơ sở dữ liệu được xây dựng dựa trên Sequelize ORM thông qua các tệp model.

### 3.1. Bảng User (Tài khoản)

Quản lý thông tin đăng nhập và phân quyền hệ thống.

| Trường | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| `id` | Integer | Khóa chính, tự động tăng |
| `email` | String | Tên đăng nhập, định dạng email, duy nhất |
| `password` | String | Mật khẩu đã được mã hóa (Hash) |
| `role` | Enum | Quyền hạn: "student", "company", "admin" |
| `is_active` | Boolean | Trạng thái hoạt động, mặc định là true |

### 3.2. Bảng StudentProfile (Hồ sơ Sinh viên)

Lưu trữ thông tin chi tiết của ứng viên.

| Trường | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| `full_name` | String | Họ và tên sinh viên, bắt buộc |
| `phone` | String(15) | Số điện thoại liên hệ |
| `gender` | Enum | Giới tính: "Nam", "Nữ", "Khác" |
| `university` | String | Trường đại học đang theo học |
| `major` | String | Chuyên ngành học |
| `gpa` | Float | Điểm trung bình tích lũy |
| `skills` | Text | Kỹ năng nổi bật (VD: NodeJS, React) |
| `cv_url` | String | Đường dẫn file CV (PDF) |
| `bio` | Text | Đoạn giới thiệu bản thân |

### 3.3. Bảng CompanyProfile (Hồ sơ Doanh nghiệp)

Lưu trữ thông tin chi tiết của nhà tuyển dụng.

| Trường | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| `company_name` | String | Tên doanh nghiệp, bắt buộc |
| `website` | String | Đường dẫn website công ty |
| `address` | String | Địa chỉ trụ sở làm việc |
| `size` | String | Quy mô nhân sự (VD: 50-100 nhân viên) |
| `industry` | String | Lĩnh vực hoạt động (VD: IT, Marketing) |
| `logo_url` | String | Đường dẫn ảnh Logo công ty |
| `description` | Text | Mô tả chi tiết về công ty, bắt buộc |

### 3.4. Bảng Job (Tin Tuyển dụng)

Quản lý các bài đăng tìm kiếm ứng viên của doanh nghiệp.

| Trường | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| `title` | String | Tiêu đề công việc, bắt buộc |
| `description` | Text | Mô tả chi tiết công việc, bắt buộc |
| `requirements` | Text | Yêu cầu đối với ứng viên |
| `salary_range` | String | Mức lương dự kiến (VD: "10-15 triệu") |
| `location` | String | Địa điểm làm việc |
| `level` | Enum | Cấp bậc: "Intern", "Fresher", "Junior", "Senior" |
| `job_type` | Enum | Hình thức: "Full-time", "Part-time", "Remote" |
| `deadline` | DateOnly | Hạn cuối nộp hồ sơ |
| `status` | Enum | Trạng thái tin đăng: "open", "closed" |

### 3.5. Bảng ApplyJob (Đơn ứng tuyển)

Lưu trữ thông tin khi sinh viên nộp hồ sơ vào một công việc.

| Trường | Kiểu dữ liệu | Mô tả |
| --- | --- | --- |
| `cover_letter` | Text | Thư giới thiệu của sinh viên |
| `cv_snapshot` | String | Link CV tại thời điểm nộp (để tránh thay đổi sau này) |
| `status` | Enum | Trạng thái duyệt: "pending", "accepted", "rejected" |
| `applied_at` | Date | Thời gian nộp đơn, mặc định là NOW |

---

## 4. DANH SÁCH API (API SPECIFICATION)

### 4.1. Authentication & Profile (Xác thực & Hồ sơ)

Các endpoint quản lý việc đăng nhập và thông tin cá nhân.

| Method | Endpoint | Mô tả | Yêu cầu (Auth/Middleware) |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Đăng nhập hệ thống | Không yêu cầu |
| `GET` | `/api/auth/profile` | Lấy thông tin hồ sơ hiện tại | `verifyToken` |
| `PUT` | `/api/auth/profile` | Cập nhật hồ sơ (hỗ trợ upload file) | `verifyToken`, `upload.single('file')` |
| `PUT` | `/api/auth/change-password` | Thay đổi mật khẩu tài khoản | `verifyToken` |

### 4.2. Admin (Quản trị viên)

Các endpoint dành riêng cho quyền quản trị.

| Method | Endpoint | Mô tả | Yêu cầu (Auth/Middleware) |
| --- | --- | --- | --- |
| `GET` | `/api/admin/users` | Lấy danh sách toàn bộ tài khoản | `verifyToken` |
| `POST` | `/api/admin/users` | Admin tạo tài khoản mới | `verifyToken` |
| `PUT` | `/api/admin/users/:id` | Chỉnh sửa tài khoản theo ID | `verifyToken` |
| `DELETE` | `/api/admin/users/:id` | Xóa tài khoản theo ID | `verifyToken` |

### 4.3. Jobs & Application (Việc làm & Ứng tuyển)

Các endpoint thao tác với công việc và luồng nộp hồ sơ.

| Method | Endpoint | Mô tả | Yêu cầu (Auth/Middleware) |
| --- | --- | --- | --- |
| `GET` | `/api/jobs` | Lấy danh sách tất cả việc làm | Không yêu cầu |
| `GET` | `/api/jobs/:id` | Lấy chi tiết công việc theo ID | Không yêu cầu |
| `GET` | `/api/jobs/student/applied` | Danh sách việc làm sinh viên đã ứng tuyển | `verifyToken` |
| `POST` | `/api/jobs` | Tạo tin tuyển dụng mới | `verifyToken` |
| `PUT` | `/api/jobs/:id` | Cập nhật thông tin tuyển dụng | `verifyToken` |
| `DELETE` | `/api/jobs/:id` | Xóa tin tuyển dụng | `verifyToken` |
| `POST` | `/api/jobs/apply` | Nộp đơn ứng tuyển công việc | `verifyToken` |
| `PUT` | `/api/jobs/apply/status` | Cập nhật trạng thái đơn (duyệt/từ chối) | `verifyToken` |
| `GET` | `/api/jobs/:id/applicants` | Xem danh sách ứng viên của 1 công việc | `verifyToken` |

### 4.4. News (Tin tức)

Quản lý các bài viết truyền thông hiển thị trên trang chủ.

| Method | Endpoint | Mô tả | Yêu cầu (Auth/Middleware) |
| --- | --- | --- | --- |
| `GET` | `/api/news` | Xem tất cả tin bài | Không yêu cầu |
| `GET` | `/api/news/:id` | Xem chi tiết 1 tin bài | Không yêu cầu |
| `POST` | `/api/news` | Tạo bài viết mới (hỗ trợ ảnh bìa) | `verifyToken`, `upload.single('cover_image')` |
| `PUT` | `/api/news/:id` | Cập nhật bài viết hiện tại | `verifyToken`, `upload.single('cover_image')` |
| `DELETE` | `/api/news/:id` | Xóa bài viết | `verifyToken` |

---

## 5. CẤU TRÚC MÃ NGUỒN & LUỒNG HOẠT ĐỘNG

### 5.1. Cơ chế phục vụ giao diện (Backend cõng Frontend)

Để tránh lỗi CORS và đơn giản hóa quá trình triển khai, hệ thống được cấu hình để Backend Node.js phục vụ trực tiếp các file tĩnh của Frontend.

* Frontend sau khi code xong sẽ chạy lệnh `npm run build` để sinh ra thư mục `dist`.
* Thư mục `dist` này được đặt bên trong Backend. File `src/index.js` của Backend sẽ bắt các request và trả về file `index.html` của React.

### 5.2. Quản lý lưu trữ tệp (Uploads)

* Các tệp tin như CV (PDF, DOCX) và Logo công ty (JPG, PNG) được xử lý qua middleware Upload và lưu trữ vật lý tại thư mục `backend/uploads` trên máy chủ.
* Hệ thống cấp quyền truy cập công khai cho thư mục này.

---

## 6. HƯỚNG DẪN TRIỂN KHAI & VẬN HÀNH

Hệ thống hiện đang được triển khai trên máy chủ dùng chung (IP: 118.70.176.240) và chạy ở cổng 8082.

### Bước 1: Quản lý Cơ sở dữ liệu (PostgreSQL)

* Database đang chạy dưới dạng Docker Container (port 5433).
* Lệnh kiểm tra container: `docker ps`
* Lệnh truy cập trực tiếp vào DB để kiểm tra data: `docker exec -it <tên_container> psql -U tuyendung_user -d xuando`

### Bước 2: Cập nhật biến môi trường (.env)

File `.env` nằm tại thư mục Backend cần chứa các thông tin cấu hình cốt lõi:

* `PORT=8082`
* Cấu hình Database (Host, User, Password, DB Name, Dialect: postgres, Port: 5433).
* Cấu hình gửi Email (`EMAIL_USER`, `EMAIL_PASS` sử dụng Mật khẩu ứng dụng của Gmail).

### Bước 3: Quy trình Cập nhật Code mới

Mỗi khi CLB có nhu cầu chỉnh sửa giao diện hoặc tính năng, thực hiện theo luồng sau:

1. Sửa code Frontend, chạy lệnh `npm run build`.
2. Xóa thư mục `dist` cũ ở Backend và chép thư mục `dist` mới vừa build sang.
3. Nếu có sửa đổi code Backend, tiến hành nạp lại tiến trình máy chủ thông qua PM2: `pm2 restart web-tuyendung`
4. Lệnh xem log hệ thống (nếu có lỗi phát sinh): `pm2 logs web-tuyendung`

---

## 7. LINK WEBSITE + TÀI KHOẢN TEST

* **Website:** http://118.70.176.240:8082/
* **Email:** admin@test.com
* **Mật khẩu:** 123456
