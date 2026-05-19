import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobApi } from '../../api/job.api';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(() => {
    const saved = localStorage.getItem('uniconnect_applied_jobs');
    if (saved) {
      const jobs = JSON.parse(saved);
      // id từ URL là chuỗi, nên cần check cả dạng chuỗi và số
      return jobs.includes(id) || jobs.includes(Number(id)) || jobs.includes(String(id));
    }
    return false;
  });

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const data = await jobApi.getJobById(id);
      setJob(data);
    } catch (error) {
      toast.error('Không tìm thấy công việc này!');
      navigate('/student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async () => {
    setIsApplying(true);
    try {
      const response = await jobApi.applyJob(id);
      toast.success(response.message || 'Nộp đơn thành công!');
      
      setHasApplied(true);
      // Lưu vào LocalStorage
      const saved = JSON.parse(localStorage.getItem('uniconnect_applied_jobs') || '[]');
      localStorage.setItem('uniconnect_applied_jobs', JSON.stringify([...saved, id]));

    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Có lỗi xảy ra khi nộp đơn!';
      
      if (errorMsg.toLowerCase().includes('đã nộp') || errorMsg.toLowerCase().includes('rồi')) {
        setHasApplied(true);
        const saved = JSON.parse(localStorage.getItem('uniconnect_applied_jobs') || '[]');
        localStorage.setItem('uniconnect_applied_jobs', JSON.stringify([...saved, id]));
        toast.success('Hệ thống ghi nhận bạn đã ứng tuyển công việc này từ trước!');
      } else {
        toast.error(errorMsg);
      }
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) return <div className="text-center mt-32 text-slate-500 font-bold uppercase tracking-widest text-sm">ĐANG TẢI DỮ LIỆU...</div>;
  if (!job) return null;

  const companyProfile = job.company?.CompanyProfile || {};
  const companyName = companyProfile.company_name || job.company?.email || 'Công ty bảo mật tên';
  const logoUrl = companyProfile.logo_url || null;
  const isPastDeadline = job.deadline ? new Date(job.deadline) < new Date() : false;
  const isClosed = job.status === 'closed' || isPastDeadline;

  return (
    <div className="font-sans bg-slate-50 min-h-screen pt-10 pb-20">
      <div className="max-w-[1300px] mx-auto px-4 flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        
        {/* ==========================================
            1. CỘT TRÁI: NÚT BACK
            ========================================== */}
        <div className="hidden lg:flex w-[60px] shrink-0 sticky top-28 flex-col items-center">
          <button 
            onClick={() => navigate('/student')} 
            title="Quay lại danh sách"
            className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm hover:-translate-x-1"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        <div className="lg:hidden w-full mb-2">
          <button onClick={() => navigate('/student')} className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            QUAY LẠI
          </button>
        </div>

        {/* ==========================================
            2. CỘT GIỮA: NỘI DUNG CHÍNH 
            ========================================== */}
        <div className="flex-1 min-w-0 w-full">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-10">
            
            <div className="mb-8 border-b border-slate-100 pb-8">
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight mb-5 uppercase">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className={`px-4 py-1.5 font-bold uppercase tracking-widest text-[10px] rounded-md ${isClosed ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'}`}>
                  {isClosed ? 'ĐÃ ĐÓNG CỬA' : 'ĐANG TUYỂN DỤNG'}
                </span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  ĐĂNG NGÀY: {new Date(job.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Địa điểm</p>
                <p className="font-black text-slate-900 text-sm">{job.location || 'CHƯA CẬP NHẬT'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mức lương</p>
                <p className="font-black text-emerald-600 text-sm">{job.salary_range || 'THỎA THUẬN'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Cấp bậc</p>
                <p className="font-black text-slate-900 text-sm">{job.level || 'CHƯA CẬP NHẬT'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Hình thức</p>
                <p className="font-black text-[#007db3] text-sm uppercase">{job.job_type || 'FULL-TIME'}</p>
              </div>
            </div>

            <div className="space-y-10">
              <section>
                <h2 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-[#007db3] rounded-sm inline-block"></span>
                  Mô tả công việc
                </h2>
                <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{job.description}</div>
              </section>

              {job.requirements && (
                <section>
                  <h2 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-[#007db3] rounded-sm inline-block"></span>
                    Yêu cầu ứng viên
                  </h2>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{job.requirements}</div>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* ==========================================
            3. CỘT PHẢI: SIDEBAR (Sticky)
            ========================================== */}
        <div className="w-full lg:w-[340px] shrink-0 sticky top-28 space-y-6">
          
          {/* Khối Ứng Tuyển */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-3">Ứng tuyển ngay</h3>
            <p className="text-xs font-medium text-slate-500 mb-6 leading-relaxed">
              Hãy đảm bảo hồ sơ và CV của bạn phù hợp với yêu cầu công việc trước khi ứng tuyển.
            </p>
            
            <button 
              onClick={handleApply} 
              disabled={isApplying || isClosed || hasApplied} 
              className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest flex justify-center items-center gap-2 transition-all duration-300 ${
                isClosed 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : hasApplied
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200 cursor-not-allowed' // Trạng thái đã ứng tuyển
                    : 'bg-slate-900 text-white hover:bg-[#007db3] shadow-md hover:shadow-blue-200 hover:-translate-y-1'
              } ${isApplying ? 'opacity-70' : ''}`}
            >
              {isApplying ? 'ĐANG GỬI HỒ SƠ...' : 
                hasApplied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    ĐÃ ỨNG TUYỂN
                  </>
                ) : 
                (isClosed ? 'ĐÃ HẾT HẠN ỨNG TUYỂN' : 'NỘP HỒ SƠ ỨNG TUYỂN')
              }
            </button>
            
            {job.deadline && !hasApplied && (
              <div className={`text-[10px] text-center mt-5 font-bold uppercase tracking-widest ${isClosed ? 'text-red-400' : 'text-slate-400'}`}>
                HẠN CHÓT: <span className={isClosed ? '' : 'text-red-500'}>{new Date(job.deadline).toLocaleDateString('vi-VN')}</span>
              </div>
            )}
          </div>

          {/* Khối Giới Thiệu Công Ty */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Về công ty</h3>
            
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 shadow-sm p-1">
                {logoUrl ? (
                  <img src={logoUrl} alt={companyName} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <span className="text-3xl font-black text-slate-300">{companyName.charAt(0)}</span>
                )}
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 leading-tight uppercase line-clamp-2">{companyName}</h4>
                {companyProfile.website && (
                  <a href={companyProfile.website.startsWith('http') ? companyProfile.website : `https://${companyProfile.website}`} target="_blank" rel="noreferrer" className="text-[#007db3] hover:text-blue-800 text-[9px] font-bold uppercase tracking-widest mt-1.5 inline-block">
                    MỞ WEBSITE NGUỒN ↗
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {companyProfile.industry && (
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Lĩnh vực</span>
                  <span className="text-[11px] font-bold text-slate-800 text-right truncate max-w-[150px]" title={companyProfile.industry}>{companyProfile.industry}</span>
                </div>
              )}
              {companyProfile.size && (
                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quy mô</span>
                  <span className="text-[11px] font-bold text-slate-800 text-right">{companyProfile.size}</span>
                </div>
              )}
              {companyProfile.address && (
                <div className="flex flex-col gap-1 border-b border-slate-50 pb-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trụ sở chính</span>
                  <span className="text-[11px] font-bold text-slate-800 leading-snug">{companyProfile.address}</span>
                </div>
              )}
            </div>

            {companyProfile.description && (
              <div>
                <p className="text-[13px] text-slate-600 leading-relaxed font-medium line-clamp-5">
                  {companyProfile.description}
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default JobDetail;