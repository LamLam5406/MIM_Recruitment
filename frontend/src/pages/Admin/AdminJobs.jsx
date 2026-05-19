import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobApi } from '../../api/job.api';
import toast from 'react-hot-toast';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // States cho Tìm kiếm, Bộ lọc & Sắp xếp
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); 
  const [sortBy, setSortBy] = useState('newest'); 
  const [industryFilter, setIndustryFilter] = useState(''); 
  const [levelFilter, setLevelFilter] = useState(''); 

  // Phân trang và bộ đếm tổng
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSystemJobs, setTotalSystemJobs] = useState(0); 
  const PAGE_SIZE = 15; 

  useEffect(() => {
    fetchAllJobs(currentPage);
  }, [currentPage, sortBy]);

  const fetchAllJobs = async (page, overrides = {}) => {
    setIsLoading(true);
    try {
      const params = {
        sortBy: overrides.sortBy !== undefined ? overrides.sortBy : sortBy,
        search: overrides.searchTerm !== undefined ? overrides.searchTerm : searchTerm,
        location: overrides.locationFilter !== undefined ? overrides.locationFilter : locationFilter,
        job_type: overrides.jobTypeFilter !== undefined ? overrides.jobTypeFilter : jobTypeFilter,
        salary_range: overrides.salaryFilter !== undefined ? overrides.salaryFilter : salaryFilter,
        status: overrides.statusFilter !== undefined ? overrides.statusFilter : statusFilter,
        industry: overrides.industryFilter !== undefined ? overrides.industryFilter : industryFilter,
        level: overrides.levelFilter !== undefined ? overrides.levelFilter : levelFilter,
      };

      const response = await jobApi.getAllJobs(page, PAGE_SIZE, params);
      setJobs(response.jobs || response.data?.jobs || []);
      setTotalPages(response.totalPages || response.data?.totalPages || 1);
      
      // Đảm bảo bộ đếm hiển thị tổng số bản ghi thực tế của toàn hệ thống trả về từ API
      setTotalSystemJobs(response.totalItems || response.total || response.data?.total || 0);
    } catch (error) {
      toast.error('Không thể tải danh sách việc làm!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này khỏi hệ thống? Hành động này không thể hoàn tác.")) {
      return;
    }
    try {
      await jobApi.deleteJob(jobId);
      toast.success('Đã xóa bài đăng thành công!');
      // Cập nhật state trực tiếp để UI phản hồi nhanh
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
      setTotalSystemJobs(prev => prev - 1);
      
      // Nếu xóa hết job ở trang hiện tại (và không phải trang 1), lùi lại 1 trang
      if (jobs.length === 1 && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa bài đăng!');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAllJobs(1); 
  };

  const clearFilters = () => {
    setLocationFilter('');
    setJobTypeFilter('');
    setSalaryFilter('');
    setStatusFilter('');
    setSearchTerm('');
    setSortBy('newest');
    setIndustryFilter('');
    setLevelFilter('');
    setCurrentPage(1);
    
    fetchAllJobs(1, {
      locationFilter: '',
      jobTypeFilter: '',
      salaryFilter: '',
      statusFilter: '',
      searchTerm: '',
      sortBy: 'newest',
      industryFilter: '',
      levelFilter: ''
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-10 font-sans">
      
      {/* Header Admin */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Quản Lý Toàn Bộ Việc Làm</h2>
          <div className="w-105 h-1.5 bg-[#007db3] rounded-full mt-3"></div>
        </div>
        <div className="text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-lg">
          TỔNG HỆ THỐNG: {totalSystemJobs} CÔNG VIỆC
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ==========================================
            CỘT TRÁI: BỘ LỌC
            ========================================== */}
        <div className="w-full lg:w-[260px] xl:w-[280px] flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-24">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#007db3]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                Bộ Lọc 
              </h2>
              <button onClick={clearFilters} className="text-[11px] font-bold text-red-500 hover:text-red-700 bg-red-50 px-2.5 py-1.5 rounded-lg transition-colors uppercase">Xóa lọc</button>
            </div>

            {/* 1. Lọc Lĩnh vực */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Lĩnh vực</label>
              <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] outline-none text-sm font-medium text-slate-700"
                value={industryFilter}
                onChange={(e) => setIndustryFilter(e.target.value)}
              >
                <option value="">Tất cả lĩnh vực</option>
                <option value="IT - Phần mềm">IT - Phần mềm</option>
                <option value="Kinh doanh / Bán hàng">Kinh doanh / Bán hàng</option>
                <option value="Marketing / PR">Marketing / PR</option>
                <option value="Kế toán / Kiểm toán">Kế toán / Kiểm toán</option>
                <option value="Thiết kế đồ họa">Thiết kế đồ họa</option>
                <option value="Kỹ thuật / Cơ khí">Kỹ thuật / Cơ khí</option>
              </select>
            </div>

            {/* 2. Lọc Địa điểm */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Địa điểm</label>
              <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] outline-none text-sm font-medium text-slate-700"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              >
                <option value="">Tất cả địa điểm</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                <option value="Cần Thơ">Cần Thơ</option>
                <option value="Hải Phòng">Hải Phòng</option>
              </select>
            </div>

            {/* 3. Lọc Cấp bậc */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Cấp bậc</label>
              <div className="space-y-3">
                {[
                  { label: 'Tất cả', value: '' },
                  { label: 'Thực tập sinh (Intern)', value: 'Intern' },
                  { label: 'Mới tốt nghiệp (Fresher)', value: 'Fresher' },
                  { label: 'Nhân viên (Junior)', value: 'Junior' },
                  { label: 'Chuyên viên (Middle/Senior)', value: 'Senior' }
                ].map((level, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="levelType" 
                      value={level.value}
                      checked={levelFilter === level.value}
                      onChange={(e) => setLevelFilter(e.target.value)}
                      className="w-4 h-4 text-[#007db3] focus:ring-[#007db3] border-slate-300 rounded" 
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-[#007db3] transition-colors">{level.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 4. Lọc Hình thức */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Hình thức</label>
              <div className="space-y-3">
                {['Tất cả', 'Full-time', 'Part-time', 'Remote'].map((type, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="jobType" 
                      value={type}
                      checked={jobTypeFilter === type || (type === 'Tất cả' && jobTypeFilter === '')}
                      onChange={(e) => setJobTypeFilter(type === 'Tất cả' ? '' : e.target.value)}
                      className="w-4 h-4 text-[#007db3] focus:ring-[#007db3] border-slate-300 rounded" 
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-[#007db3] transition-colors">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 5. Lọc Mức lương */}
            <div className="mb-8">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Mức lương</label>
              <div className="space-y-3">
                {['Tất cả', 'Thỏa thuận', 'Dưới 10 triệu', '10 - 20 triệu', 'Trên 20 triệu'].map((salary, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="salaryType" 
                      value={salary}
                      checked={salaryFilter === salary || (salary === 'Tất cả' && salaryFilter === '')}
                      onChange={(e) => setSalaryFilter(salary === 'Tất cả' ? '' : e.target.value)}
                      className="w-4 h-4 text-[#007db3] focus:ring-[#007db3] border-slate-300 rounded" 
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-[#007db3] transition-colors">{salary}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 6. Lọc Trạng thái */}
            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Trạng thái</label>
              <div className="space-y-3">
                {[
                  { label: 'Tất cả', value: '' },
                  { label: 'Đang mở', value: 'open' },
                  { label: 'Đã đóng', value: 'closed' }
                ].map((status, idx) => (
                  <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="statusType" 
                      value={status.value}
                      checked={statusFilter === status.value}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-4 h-4 text-[#007db3] focus:ring-[#007db3] border-slate-300 rounded" 
                    />
                    <span className="text-sm font-medium text-slate-600 group-hover:text-[#007db3] transition-colors">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button 
              onClick={() => {
                setCurrentPage(1);
                fetchAllJobs(1);
              }}
              className="w-full bg-[#007db3]/10 text-[#007db3] font-bold py-3.5 rounded-xl border border-transparent hover:bg-[#007db3] hover:text-white transition-all text-sm shadow-sm"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>

        {/* ==========================================
            CỘT PHẢI: TÌM KIẾM & DANH SÁCH VIỆC LÀM
            ========================================== */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* --- THANH TÌM KIẾM --- */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2.5 mb-6 flex flex-col sm:flex-row gap-2 items-center z-10">
            <div className="flex-1 w-full relative flex items-center bg-slate-50 rounded-xl px-2 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
              <svg className="w-5 h-5 text-[#007db3] absolute left-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Tìm kiếm theo tiêu đề, tên công ty..." 
                className="w-full pl-9 pr-3 py-2.5 bg-transparent border-none focus:ring-0 text-slate-800 outline-none text-sm font-semibold placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sắp xếp:</span>
                <select 
                  className="bg-transparent border-none focus:ring-0 text-[#007db3] font-bold outline-none text-sm cursor-pointer p-0 pr-4"
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="deadline">Sắp hết hạn</option>
                </select>
              </div>
              <button 
                type="submit"
                className="bg-[#007db3] text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-sm text-sm whitespace-nowrap"
              >
                Tìm
              </button>
            </div>
          </form>

          {/* --- DANH SÁCH VIỆC LÀM (GRID) --- */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-pulse h-[220px]"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center text-slate-500 py-16 bg-slate-50 border border-dashed border-slate-300 rounded-2xl mt-4">
              <p className="text-slate-900 font-black text-lg mb-2 uppercase tracking-widest">KHÔNG TÌM THẤY CÔNG VIỆC NÀO</p>
              <p className="text-sm">Thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {jobs.map((job) => {
                  const isPastDeadline = job.deadline ? new Date(job.deadline) < new Date() : false;
                  const isClosed = job.status === 'closed' || isPastDeadline;

                  return (
                    <div key={job.id} className={`group bg-white p-5 rounded-2xl shadow-sm border ${isClosed ? 'border-slate-100 bg-slate-50/50' : 'border-slate-200 hover:border-blue-300 hover:shadow-lg'} transition-all duration-300 flex flex-col h-full relative`}>
                      
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-md border ${isClosed ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                          {isClosed ? 'ĐÃ ĐÓNG' : 'ĐANG MỞ'}
                        </span>
                      </div>

                      <div className="mb-2 pr-16">
                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-1.5">
                          ĐĂNG NGÀY: {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                        </p>
                        <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-2 h-12 mb-1">
                          {job.title}
                        </h3>
                        <p className="text-[#007db3] text-[10px] font-black uppercase tracking-widest truncate mb-3">
                          {job.company?.CompanyProfile?.company_name || 'CÔNG TY CHƯA CẬP NHẬT'}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 mb-6 flex-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 pb-2">
                          <span className="text-slate-400 uppercase tracking-widest">Hạn nộp</span>
                          <span className={`truncate text-right ${isClosed ? 'text-red-500' : 'text-slate-700'}`}>{job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'N/A'}</span>
                        </div>
                      </div>

                      {/* Khu vực Nút thao tác Admin */}
                      <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                        <button 
                          onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                          className="flex-1 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-200 transition-all border border-slate-200"
                        >
                          SỬA
                        </button>
                        <button 
                          onClick={() => handleDelete(job.id)}
                          className="flex-1 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all border border-red-100"
                        >
                          XÓA
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="mt-8 mb-4 flex justify-center">
                  <div className="inline-flex items-center p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <button 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                      disabled={currentPage <= 1} 
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-[#007db3] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all"
                    >
                      Trước
                    </button>
                    
                    <div className="px-6 text-sm font-bold text-slate-600">
                      <span className="text-[#007db3]">{currentPage}</span> / {totalPages}
                    </div>

                    <button 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                      disabled={currentPage >= totalPages} 
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-[#007db3] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500 transition-all"
                    >
                      Sau
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminJobs;