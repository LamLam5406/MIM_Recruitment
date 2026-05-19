import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../../api/job.api';
import toast from 'react-hot-toast';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  
  const [appliedJobs, setAppliedJobs] = useState(() => {
    const saved = localStorage.getItem('uniconnect_applied_jobs');
    return saved ? JSON.parse(saved) : [];
  });

  // States cho Tìm kiếm, Bộ lọc & Sắp xếp
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('open'); 
  const [sortBy, setSortBy] = useState('newest'); 
  
  const [industryFilter, setIndustryFilter] = useState(''); 
  const [levelFilter, setLevelFilter] = useState(''); 

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobsCount, setTotalJobsCount] = useState(0); 
  const PAGE_SIZE = 15; 

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage, sortBy]);

  const fetchJobs = async (page, overrides = {}) => {
    setLoading(true);
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
      setJobs(response.jobs || []);
      setTotalPages(response.totalPages || 1);
      setTotalJobsCount(response.totalItems || 0); 
    } catch (error) {
      toast.error('Không thể tải danh sách việc làm!');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    setApplyingId(jobId);
    try {
      const response = await jobApi.applyJob(jobId);
      toast.success(response.message || 'Nộp đơn thành công!');
      
      // Lưu vào state và LocalStorage
      setAppliedJobs(prev => {
        const newList = [...prev, jobId];
        localStorage.setItem('uniconnect_applied_jobs', JSON.stringify(newList));
        return newList;
      }); 
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Có lỗi xảy ra khi nộp đơn!';
      
      // Bắt lỗi trùng lặp từ Backend để tự động cập nhật UI
      if (errorMsg.toLowerCase().includes('đã nộp') || errorMsg.toLowerCase().includes('rồi')) {
        setAppliedJobs(prev => {
          const newList = [...prev, jobId];
          localStorage.setItem('uniconnect_applied_jobs', JSON.stringify(newList));
          return newList;
        });
        toast.success('Hệ thống ghi nhận bạn đã ứng tuyển job này từ trước!');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setApplyingId(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs(1); 
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
    
    fetchJobs(1, {
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
    <div className="font-sans max-w-[1600px] w-full mx-auto pb-12">
        
      {/* --- MAIN LAYOUT (2 CỘT) --- */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* ==========================================
            CỘT TRÁI: BỘ LỌC (CHIẾM TRỌN CỘT)
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
                  { label: 'Đang tuyển', value: 'open' },
                  { label: 'Đã kết thúc', value: 'closed' }
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
                fetchJobs(1);
              }}
              className="w-full bg-[#007db3]/10 text-[#007db3] font-bold py-3.5 rounded-xl border border-transparent hover:bg-[#007db3] hover:text-white transition-all text-sm shadow-sm"
            >
              Áp dụng bộ lọc
            </button>
          </div>
        </div>

        {/* ==========================================
            CỘT PHẢI: TÌM KIẾM & LƯỚI THẺ
            ========================================== */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* --- THANH TÌM KIẾM --- */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2.5 mb-6 flex flex-col sm:flex-row gap-2 items-center z-10">
            <div className="flex-1 w-full relative flex items-center bg-slate-50 rounded-xl px-2 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
              <svg className="w-5 h-5 text-[#007db3] absolute left-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input 
                type="text" 
                placeholder="Nhập tên công việc, kỹ năng..." 
                className="w-full pl-9 pr-3 py-2.5 bg-transparent border-none focus:ring-0 text-slate-800 outline-none text-sm font-semibold placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-auto flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Ưu tiên:</span>
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

          {/* --- HEADER KẾT QUẢ --- */}
          <div className="flex items-center mb-5 bg-white px-5 py-3 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-sm font-bold text-slate-700">
              Tìm thấy <span className="text-[#007db3] text-base mx-1">{totalJobsCount}</span> cơ hội việc làm
            </h2>
          </div>

          {/* --- GRID THẺ CÔNG VIỆC --- */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-pulse h-[280px]"></div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-800 font-bold text-lg mb-1">Không tìm thấy công việc nào!</p>
              <p className="text-slate-500 text-sm">Thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm nhé.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {jobs.map((job) => {
                  const companyName = job.company?.CompanyProfile?.company_name || job.company?.email || 'Công ty ẩn danh';
                  const logoUrl = job.company?.CompanyProfile?.logo_url || null;
                  const isPastDeadline = job.deadline ? new Date(job.deadline) < new Date() : false;
                  const isClosed = job.status === 'closed' || isPastDeadline;
                  const isUrgent = sortBy === 'deadline' && !isClosed;
                  
                  // Xác định xem job này đã được apply ở session hiện tại chưa
                  const hasApplied = appliedJobs.includes(job.id); 

                  return (
                    <div key={job.id} className={`group bg-white p-4 rounded-2xl shadow-sm border ${isClosed ? 'border-slate-100 opacity-75' : 'border-slate-200 hover:border-blue-300 hover:shadow-lg'} transition-all duration-300 flex flex-col h-full relative`}>
                      
                      {isUrgent && (
                        <span className="absolute top-3 right-3 bg-red-50 text-red-600 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-red-100">
                          Gấp
                        </span>
                      )}

                      <div className="mb-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-black uppercase border mb-2 overflow-hidden ${isClosed ? 'bg-slate-50 border-slate-100 text-slate-300' : 'bg-[#007db3] border-[#007db3] text-white shadow-sm'}`}>
                          {logoUrl ? (
                            <img src={logoUrl} alt={companyName} className="w-full h-full object-contain bg-white" />
                          ) : (
                            companyName.charAt(0)
                          )}
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wide truncate pr-6" title={companyName}>
                          {companyName}
                        </p>
                      </div>

                      <h3 className="text-sm font-extrabold text-slate-800 leading-snug line-clamp-2 h-10 mb-3 group-hover:text-[#007db3] transition-colors" title={job.title}>
                        <Link to={`/student/jobs/${job.id}`}>
                          {job.title}
                        </Link>
                      </h3>

                      <div className="flex flex-col gap-2 mb-4 flex-1">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                          <span className="text-slate-400">Khu vực:</span>
                          <span className="truncate">{job.location || 'Chưa cập nhật'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                          <span className="text-slate-400">Mức lương:</span>
                          <span className="truncate">{job.salary_range || 'Thỏa thuận'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600">
                          <span className="text-slate-400">Hình thức:</span>
                          <span className="truncate">{job.job_type || 'Full-time'}</span>
                        </div>
                      </div>

                      <div className="mt-auto pt-3 border-t border-slate-100">
                        {job.deadline && (
                          <div className={`text-[10px] font-bold text-center mb-2 ${isClosed ? 'text-red-400' : 'text-slate-400'}`}>
                            Hạn: {new Date(job.deadline).toLocaleDateString('vi-VN')}
                          </div>
                        )}
                        <button 
                          onClick={() => handleApply(job.id)}
                          disabled={applyingId === job.id || isClosed || hasApplied}
                          className={`w-full py-2.5 rounded-lg font-bold text-[11px] uppercase tracking-wider flex justify-center items-center gap-1.5 transition-all ${
                            isClosed 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                              : hasApplied
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed' // Trạng thái đã ứng tuyển
                                : 'bg-slate-900 text-white hover:bg-[#007db3] shadow-md hover:shadow-blue-200'
                          } ${applyingId === job.id ? 'opacity-70' : ''}`}
                        >
                          {applyingId === job.id ? 'Đang gửi...' : 
                            hasApplied ? (
                              <>
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                Đã ứng tuyển
                              </>
                            ) : 
                            (isClosed ? 'Đã đóng' : 'Ứng tuyển')
                          }
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
              
              {/* Phân trang dưới cùng với thiết kế mượt mà */}
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

export default JobList;