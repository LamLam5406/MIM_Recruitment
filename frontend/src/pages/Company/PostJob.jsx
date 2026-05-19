import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobApi } from '../../api/job.api';
import toast from 'react-hot-toast';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '', description: '', requirements: '', salary_range: '', 
    location: '', level: 'Fresher', job_type: 'Full-time', deadline: '', status: 'open'
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await jobApi.createJob(formData);
      toast.success('Đăng tin tuyển dụng thành công!');
      navigate('/company');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra khi đăng tin!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans max-w-[900px] mx-auto p-8 md:p-10 mt-8 bg-white rounded-3xl shadow-sm border border-slate-200">
      
      <div className="mb-10">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Tạo Tin Tuyển Dụng Mới</h2>
        <div className="w-12 h-1 bg-[#007db3] rounded-full mt-3"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Khối Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tiêu đề công việc (*)</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} placeholder="VD: Thực tập sinh ReactJS, Chuyên viên Marketing..." className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400" />
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
            <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="VD: Hà Nội, Hồ Chí Minh..." className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400" />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mức lương</label>
            <input type="text" name="salary_range" value={formData.salary_range} onChange={handleChange} placeholder="VD: 10 - 15 triệu, Thỏa thuận..." className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400" />
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
            <textarea name="description" required rows={5} value={formData.description} onChange={handleChange} placeholder="Chi tiết công việc, trách nhiệm hàng ngày..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400 leading-relaxed resize-y"></textarea>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Yêu cầu ứng viên</label>
            <textarea name="requirements" rows={5} value={formData.requirements} onChange={handleChange} placeholder="Kinh nghiệm, kỹ năng, thái độ..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400 leading-relaxed resize-y"></textarea>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-slate-100">
          <button type="button" onClick={() => navigate('/company')} className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all">
            Hủy bỏ
          </button>
          <button type="submit" disabled={isLoading} className={`w-full sm:w-auto px-10 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-[#007db3] transition-all text-xs tracking-widest uppercase shadow-md hover:shadow-blue-200/50 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
            {isLoading ? 'ĐANG ĐĂNG TIN...' : 'ĐĂNG TIN TUYỂN DỤNG'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostJob;