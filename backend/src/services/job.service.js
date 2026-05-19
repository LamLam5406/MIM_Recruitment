const db = require('../models');
const { Op } = require('sequelize');

const jobService = {
  // Lấy tất cả job (kèm thông tin công ty đăng tuyển)
  getAllJobs: async (page, limit, filters = {}) => {
    const offset = (page - 1) * limit;

    // Sử dụng một mảng để chứa tất cả các điều kiện lọc
    const andConditions = [];

    // 1. Lọc theo ENUM (Trạng thái & Hình thức)
    if (filters.company_id) {
      andConditions.push({ company_id: filters.company_id });
    }
    if (filters.status) {
      andConditions.push({ status: filters.status });
    }
    if (filters.job_type) {
      andConditions.push({ job_type: filters.job_type });
    }
    if (filters.level) {
      andConditions.push({ level: filters.level });
    }

    // 2. Lọc theo chuỗi tương đối (VARCHAR/TEXT)
    // 🟢 SỬA LIKE THÀNH ILIKE CHO POSTGRESQL
    if (filters.location) {
      andConditions.push({ location: { [Op.iLike]: `%${filters.location}%` } }); 
    }
    if (filters.salary_range) {
      andConditions.push({ salary_range: { [Op.iLike]: `%${filters.salary_range}%` } });
    }

    // 4. LĨNH VỰC: Quét chuỗi trong Title bằng các từ khóa tương ứng
    if (filters.industry) {
      let industryKeywords = [];
      switch(filters.industry) {
        case 'IT - Phần mềm': 
          industryKeywords = ['IT', 'Phần mềm', 'Software', 'Developer', 'Dev', 'Lập trình']; 
          break;
        case 'Kinh doanh / Bán hàng': 
          industryKeywords = ['Kinh doanh', 'Bán hàng', 'Sale']; 
          break;
        case 'Marketing / PR': 
          industryKeywords = ['Marketing', 'PR', 'Truyền thông', 'Content']; 
          break;
        case 'Kế toán / Kiểm toán': 
          industryKeywords = ['Kế toán', 'Kiểm toán', 'Account']; 
          break;
        case 'Thiết kế đồ họa': 
          industryKeywords = ['Thiết kế', 'Đồ họa', 'Design', 'UI', 'UX']; 
          break;
        case 'Kỹ thuật / Cơ khí': 
          industryKeywords = ['Kỹ thuật', 'Cơ khí', 'Engineer']; 
          break;
        default: 
          industryKeywords = [filters.industry];
      }

      // Tạo điều kiện OR: Chỉ cần title chứa 1 trong các từ khóa trên là hợp lệ
      if (industryKeywords.length > 0) {
        // 🟢 SỬA LIKE THÀNH ILIKE
        const indConditions = industryKeywords.map(kw => ({ title: { [Op.iLike]: `%${kw}%` } }));
        andConditions.push({ [Op.or]: indConditions });
      }
    }

    // 5. Ô TÌM KIẾM TỰ DO: Quét trong Title, Description và Requirements
    if (filters.search) {
      andConditions.push({
        [Op.or]: [
          // 🟢 SỬA TOÀN BỘ LIKE THÀNH ILIKE Ở ĐÂY
          { title: { [Op.iLike]: `%${filters.search}%` } },
          { description: { [Op.iLike]: `%${filters.search}%` } },
          { requirements: { [Op.iLike]: `%${filters.search}%` } }
        ]
      });
    }

    // Lắp ráp Where Clause cuối cùng
    const whereClause = andConditions.length > 0 ? { [Op.and]: andConditions } : {};

    // 6. Xử lý sắp xếp (Sort)
    let orderClause = [['createdAt', 'DESC']]; // Mặc định là mới nhất
    if (filters.sortBy === 'deadline') {
      orderClause = [['deadline', 'ASC']]; // Sắp hết hạn ưu tiên lên đầu
    }

    const { count, rows } = await db.Job.findAndCountAll({
      limit: limit,
      offset: offset,
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'company',
          attributes: ['id', 'email'],
          include: [{ model: db.CompanyProfile }]
        }
      ],
      order: orderClause
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      jobs: rows
    };
  },

  getJobById: async (id) => {
    return await db.Job.findByPk(id, {
      include: [
        {
          model: db.User,
          as: 'company',
          attributes: ['id', 'email'],
          include: [{ model: db.CompanyProfile }] // Kéo theo profile công ty
        }
      ]
    });
  },

  createJob: async (data) => {
    // data gồm: { title, description, company_id, ... }
    return await db.Job.create(data);
  },

  // Cập nhật lại job.service.js -> applyJob
  applyJob: async (job_id, student_id) => {
    // 1. KIỂM TRA CÔNG VIỆC CÓ TỒN TẠI VÀ CÒN HẠN KHÔNG
    const job = await db.Job.findByPk(job_id);
    if (!job) {
      throw new Error("Công việc không tồn tại!");
    }

    // Giả sử model Job của bạn có trường status ('open', 'closed')
    if (job.status !== 'open') {
      throw new Error("Công việc này đã đóng, không thể nộp thêm hồ sơ!");
    }

    // (Tùy chọn bổ sung) Kiểm tra deadline nếu có
    // if (job.deadline && new Date(job.deadline) < new Date()) {
    //   throw new Error("Đã quá hạn nộp hồ sơ cho công việc này!");
    // }

    // 2. KIỂM TRA SINH VIÊN ĐÃ NỘP ĐƠN CHƯA
    const existing = await db.ApplyJob.findOne({ where: { job_id, student_id } });
    if (existing) {
      throw new Error("Bạn đã nộp đơn cho công việc này rồi!");
    }

    // 3. LẤY CV CỦA SINH VIÊN
    const studentProfile = await db.StudentProfile.findOne({ where: { user_id: student_id } });

    // Rất quan trọng: Bắt buộc sinh viên phải có CV mới cho nộp
    if (!studentProfile || !studentProfile.cv_url) {
      throw new Error("Bạn chưa có CV! Vui lòng cập nhật CV trong hồ sơ trước khi ứng tuyển.");
    }

    // 4. TẠO ĐƠN ỨNG TUYỂN
    return await db.ApplyJob.create({
      job_id,
      student_id,
      cv_snapshot: studentProfile.cv_url, // Chắc chắn có CV rồi mới lưu
      status: "pending"
    });
  },

  getApplicants: async (job_id) => {
    return await db.ApplyJob.findAll({
      where: { job_id },
      include: [
        { 
          model: db.User, 
          as: 'student', 
          attributes: ['email'],
          include: [{ model: db.StudentProfile }] // <--- BỔ SUNG DÒNG NÀY
        }
      ]
    });
  },

  updateStatus: async (job_id, student_id, status, company_id) => {
    // 1. Kiểm tra xem job này có thuộc về công ty đang request không
    const job = await db.Job.findByPk(job_id);
    if (!job) throw new Error("Không tìm thấy công việc");
    if (job.company_id !== company_id) { // Giả sử bảng Job có cột company_id
      throw new Error("Bạn không có quyền duyệt hồ sơ cho công việc này!");
    }

    // 2. Tiến hành cập nhật
    const application = await db.ApplyJob.findOne({
      where: { job_id, student_id }
    });
    if (!application) throw new Error("Không tìm thấy đơn ứng tuyển");

    application.status = status;
    await application.save();
    return application;
  },

  // Update 17/5
  updateJob: async (id, data) => {
    // 1. Thực thi câu lệnh SQL UPDATE
    await db.Job.update(data, {
      where: { id: id }
    });
    
    // 2. Truy vấn lại để trả về bản ghi mới nhất sau khi cập nhật
    return await db.Job.findByPk(id);
  },

  deleteJob: async (id) => {
    // 1. Xóa tất cả các đơn ứng tuyển (ApplyJob) liên kết với công việc này trước
    // Điều này ngăn chặn lỗi Foreign Key Constraint Violation từ cơ sở dữ liệu
    await db.ApplyJob.destroy({
      where: { job_id: id }
    });

    // 2. Thực thi câu lệnh SQL DELETE trên bảng Job
    return await db.Job.destroy({
      where: { id: id }
    });
  },
  // Lấy danh sách công việc mà sinh viên đã ứng tuyển
  getAppliedJobs: async (student_id) => {
    return await db.ApplyJob.findAll({
      where: { student_id },
      include: [
        {
          model: db.Job,
          as: 'job', // <--- BẮT BUỘC KHAI BÁO VÌ TRONG index.js CÓ as: 'job'
          include: [
            {
              model: db.User,
              as: 'company', // <--- BẮT BUỘC KHAI BÁO VÌ TRONG index.js CÓ as: 'company'
              attributes: ['id', 'email'],
              include: [{ model: db.CompanyProfile }] // Không có as nên gọi thẳng model
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  },
};

module.exports = jobService;