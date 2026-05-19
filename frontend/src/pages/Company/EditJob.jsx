import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobApi } from '../../api/job.api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const EditJob = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Lấy thông tin user để nhận diện Role
  
  const [formData, setFormData] = useState({
    title: '', description: '', requirements: '', salary_range: '', 
    location: '', level: 'Fresher', job_type: 'Full-time', deadline: '', status: 'open'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Hàm xử lý điều hướng linh hoạt theo Role
  const handleBackNavigation = () => {
    if (user?.role === 'admin') {
      navigate('/admin/jobs');
    } else {
      navigate('/company');
    }
  };

  // Fetch dữ liệu cũ khi component mount
  useEffect(() => {
    const fetchJobDetails = async () => {
      console.log("🔍 [DEBUG FETCH 1] Giá trị ID lấy được từ URL (useParams):", id);

      if (!id) {
        console.error("❌ [DEBUG FETCH] Lỗi: ID là undefined. Hãy kiểm tra lại cấu hình Route trong App.jsx (phải là :id chứ không phải :jobId).");
        toast.error('Lỗi đường dẫn!');
        setIsFetching(false);
        return;
      }

      try {
        console.log(`⏳ [DEBUG FETCH 2] Đang gọi API lấy chi tiết bài đăng: jobApi.getJobById(${id})`);
        const response = await jobApi.getJobById(id);
        
        console.log("📦 [DEBUG FETCH 3] Toàn bộ phản hồi (Response) từ API:", response);

        const jobData = response?.data?.job || response?.job || response?.data || response; 
        console.log("🎯 [DEBUG FETCH 4] Dữ liệu jobData sau khi bóc tách:", jobData);

        if (!jobData || Object.keys(jobData).length === 0) {
           console.warn("⚠️ [DEBUG FETCH] Cảnh báo: jobData bị rỗng hoặc không đúng cấu trúc!");
        }

        let formattedDeadline = '';
        if (jobData.deadline) {
          const parsedDate = new Date(jobData.deadline);
          
          if (!isNaN(parsedDate.getTime())) {
              formattedDeadline = parsedDate.toISOString().split('T')[0];
          } else {
              console.warn(`[Cảnh báo Frontend] Giá trị deadline từ server không hợp lệ: ${jobData.deadline}`);
              formattedDeadline = '';
          }
        }

        setFormData({
          title: jobData.title || '',
          description: jobData.description || '',
          requirements: jobData.requirements || '',
          salary_range: jobData.salary_range || '',
          location: jobData.location || '',
          level: jobData.level || 'Fresher',
          job_type: jobData.job_type || 'Full-time',
          deadline: formattedDeadline,
          status: jobData.status || 'open'
        });
        
        console.log("✅ [DEBUG FETCH 5] Đã set State thành công!");
      } catch (error) {
        console.error("❌ [DEBUG FETCH 6] LỖI KHI GỌI API LẤY THÔNG TIN!");
        console.error("👉 Lỗi nguyên bản:", error);
        
        if (error.response) {
          console.error("👉 HTTP Status Code:", error.response.status);
          console.error("👉 Chi tiết lỗi từ Backend:", error.response.data);
          const fullUrl = (error.config?.baseURL || '') + (error.config?.url || '');
          console.error("👉 API URL đã gọi:", fullUrl);
        } else {
          console.error("👉 Lỗi Frontend hoặc không thể kết nối tới Backend.");
        }

        toast.error('Không thể tải thông tin bài đăng!');
        handleBackNavigation();
      } finally {
        setIsFetching(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(`🚀 [DEBUG] Đang gửi request CẬP NHẬT bài đăng ID: ${id}`);
    console.log("📦 [DEBUG] Dữ liệu gửi đi (Payload):", formData);

    try {
      await jobApi.updateJob(id, formData);
      toast.success('Cập nhật tin tuyển dụng thành công!');
      handleBackNavigation(); // Tự động quay về trang danh sách phù hợp với Role
    } catch (error) {
      console.error("❌ [DEBUG] LỖI KHI CẬP NHẬT BÀI ĐĂNG!");
      console.error("👉 Lỗi nguyên bản (Raw Error):", error);

      if (error.response) {
        console.error("👉 HTTP Status:", error.response.status);
        console.error("👉 Dữ liệu Backend trả về:", error.response.data);
        
        const fullUrl = (error.config?.baseURL || '') + (error.config?.url || '');
        console.error("👉 Đường dẫn API đã gọi:", fullUrl);

        const errorMessage = error.response.data?.error || error.response.data?.message || 'Có lỗi xảy ra khi cập nhật! (Xem Console)';
        toast.error(errorMessage);

      } else if (error.request) {
        console.error("👉 Không nhận được phản hồi từ Backend. Hãy kiểm tra xem server Node.js có đang chạy không.");
        toast.error("Không kết nối được với máy chủ!");
      } else {
        console.error("👉 Lỗi Frontend React:", error.message);
        toast.error("Lỗi hệ thống Frontend!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center mt-32 text-slate-500 font-bold uppercase tracking-widest text-sm">ĐANG TẢI DỮ LIỆU...</div>;
  }

  return (
    <div className="font-sans max-w-[900px] mx-auto p-8 md:p-10 mt-8 bg-white rounded-3xl shadow-sm border border-slate-200">
      <div className="mb-10">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Chỉnh Sửa Tin Tuyển Dụng</h2>
        <div className="w-12 h-1 bg-[#007db3] rounded-full mt-3"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Khối Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tiêu đề công việc (*)</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cấp bậc</label>
            <select name="level" value={formData.level} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-bold text-slate-700 transition-all">
              <option value="Intern">Thực tập sinh (Intern)</option>
              <option value="Fresher">Mới tốt nghiệp (Fresher)</option>
              <option value="Junior">Nhân viên (Junior)</option>
              <option value="Senior">Chuyên viên (Senior)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hình thức làm việc</label>
            <select name="job_type" value={formData.job_type} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-bold text-slate-700 transition-all">
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Địa điểm làm việc</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mức lương</label>
            <input type="text" name="salary_range" value={formData.salary_range} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hạn nộp hồ sơ</label>
            <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-bold text-slate-700 transition-all" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Trạng thái</label>
            <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-bold text-slate-700 transition-all">
              <option value="open">Đang mở (Nhận hồ sơ)</option>
              <option value="closed">Đã đóng (Dừng nhận)</option>
            </select>
          </div>
        </div>

        {/* Khối Văn bản dài */}
        <div className="space-y-6 pt-2">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mô tả công việc (*)</label>
            <textarea name="description" required rows={5} value={formData.description} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400 leading-relaxed resize-y"></textarea>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Yêu cầu ứng viên</label>
            <textarea name="requirements" rows={5} value={formData.requirements} onChange={handleChange} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400 leading-relaxed resize-y"></textarea>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-slate-100">
          <button type="button" onClick={handleBackNavigation} className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
            Hủy bỏ
          </button>
          <button type="submit" disabled={isLoading} className={`w-full sm:w-auto px-10 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-[#007db3] transition-all text-xs tracking-widest uppercase shadow-md hover:shadow-blue-200/50 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? 'ĐANG LƯU...' : 'LƯU THAY ĐỔI'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditJob;