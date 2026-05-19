const jobService = require('../services/job.service');

const jobController = {
  createJob: async (req, res) => {
    try {
      // Thêm check role:
      if (req.user.role !== 'company') {
        return res.status(403).json({ message: "Chỉ công ty mới được đăng tin tuyển dụng!" });
      }
      // Lấy company_id từ user đang đăng nhập (req.user.id) thay vì req.body
      const jobData = { ...req.body, company_id: req.user.id }; 
      
      const job = await jobService.createJob(jobData);
      res.status(201).json(job);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  getAllJobs: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 15; // Khớp với PAGE_SIZE ở React

      // Lấy toàn bộ tham số bộ lọc từ Query String
      const filters = {
        search: req.query.search,
        location: req.query.location,
        job_type: req.query.job_type,
        salary_range: req.query.salary_range,
        status: req.query.status,
        industry: req.query.industry,
        level: req.query.level,
        sortBy: req.query.sortBy,
        company_id: req.query.company_id
      };

      // Truyền filters xuống service
      const result = await jobService.getAllJobs(page, limit, filters);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  getJobById: async (req, res) => {
    try {
      const job = await jobService.getJobById(req.params.id);
      if (!job) return res.status(404).json({ message: "Not found" });
      res.json(job);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  applyJob: async (req, res) => {
    try {
      const { job_id } = req.body; 

      // Kiểm tra đầu vào
      if (!job_id) {
        return res.status(400).json({ message: "Vui lòng cung cấp job_id để ứng tuyển!" });
      }

      const student_id = req.user.id; 

      if (req.user.role !== 'student') {
        return res.status(403).json({ message: "Chỉ sinh viên mới được ứng tuyển!" });
      }

      await jobService.applyJob(job_id, student_id);
      res.json({ message: "Nộp đơn thành công!" });
    } catch (e) {
      res.status(400).json({ error: e.message }); 
    }
  },

  getJobApplicants: async (req, res) => {
    try {
      // 1. Kiểm tra role
      if (req.user.role !== 'company') {
        return res.status(403).json({ message: "Chỉ công ty mới được xem danh sách ứng viên!" });
      }

      const jobId = req.params.id;
      const companyId = req.user.id;

      // 2. Kiểm tra quyền sở hữu công việc
      const job = await jobService.getJobById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Không tìm thấy công việc này." });
      }
      
      if (job.company_id !== companyId) {
        return res.status(403).json({ message: "Bạn không có quyền xem hồ sơ của công việc không do bạn đăng!" });
      }

      // 3. Lấy danh sách nếu qua được các vòng kiểm tra
      const list = await jobService.getApplicants(jobId);
      res.json(list);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  updateApplicationStatus: async (req, res) => {
    try {
      if (req.user.role !== 'company') {
        return res.status(403).json({ message: "Chỉ công ty đăng tuyển mới được duyệt hồ sơ!" });
      }

      const { job_id, student_id, status } = req.body;
      const company_id = req.user.id; 
      
      // Truyền thêm company_id xuống service để kiểm tra chéo
      await jobService.updateStatus(job_id, student_id, status, company_id);
      res.json({ message: "Cập nhật thành công" });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  updateJob: async (req, res) => {
    try {
      const userRole = req.user.role;
      const userId = req.user.id;
      const jobId = req.params.id;

      // 1. Kiểm tra vai trò hợp lệ (Chỉ Admin hoặc Company mới được phép)
      if (userRole !== 'company' && userRole !== 'admin') {
        return res.status(403).json({ message: "Bạn không có quyền sửa tin tuyển dụng này!" });
      }
      
      // 2. Kiểm tra sự tồn tại của công việc
      const job = await jobService.getJobById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Không tìm thấy công việc này." });
      }

      // 3. Nếu là Company thì bắt buộc phải là chủ sở hữu bài đăng (Admin bỏ qua check này)
      if (userRole === 'company' && job.company_id !== userId) {
        return res.status(403).json({ message: "Bạn không có quyền sửa công việc của công ty khác!" });
      }

      // 4. Xử lý cập nhật dữ liệu
      const updatedJob = await jobService.updateJob(jobId, req.body);
      res.json({ message: "Cập nhật thành công", job: updatedJob });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  deleteJob: async (req, res) => {
    try {
      const userRole = req.user.role;
      const userId = req.user.id;
      const jobId = req.params.id;

      // 1. Kiểm tra vai trò hợp lệ (Chỉ Admin hoặc Company mới được phép)
      if (userRole !== 'company' && userRole !== 'admin') {
        return res.status(403).json({ message: "Bạn không có quyền xóa tin tuyển dụng này!" });
      }

      // 2. Kiểm tra sự tồn tại của công việc
      const job = await jobService.getJobById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Không tìm thấy công việc này." });
      }

      // 3. Nếu là Company thì bắt buộc phải là chủ sở hữu bài đăng (Admin bỏ qua check này)
      if (userRole === 'company' && job.company_id !== userId) {
        return res.status(403).json({ message: "Bạn không có quyền xóa công việc của công ty khác!" });
      }

      // 4. Xử lý xóa dữ liệu
      await jobService.deleteJob(jobId);
      res.json({ message: "Đã xóa công việc thành công!" });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },
  getAppliedJobs: async (req, res) => {
    try {
      // 1. Kiểm tra quyền, chỉ sinh viên mới được xem danh sách này
      if (req.user.role !== 'student') {
        return res.status(403).json({ message: "Chỉ sinh viên mới được xem lịch sử ứng tuyển!" });
      }

      // 2. Lấy ID của sinh viên từ token đăng nhập
      const studentId = req.user.id;

      // 3. Gọi service để lấy dữ liệu
      const appliedList = await jobService.getAppliedJobs(studentId);
      
      res.json(appliedList);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};

module.exports = jobController;