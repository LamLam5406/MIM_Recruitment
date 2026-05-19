import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobApi } from '../../api/job.api';
import toast from 'react-hot-toast';

const ApplicantList = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      const data = await jobApi.getJobApplicants(jobId);
      setApplicants(data);
    } catch (error) {
      toast.error('Không thể tải danh sách ứng viên!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (studentId, newStatus) => {
    try {
      await jobApi.updateApplicationStatus(jobId, studentId, newStatus);
      toast.success(`Đã chuyển trạng thái thành: ${newStatus === 'accepted' ? 'Chấp nhận' : 'Từ chối'}`);
      fetchApplicants(); 
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi cập nhật trạng thái');
    }
  };

  if (isLoading) return <div className="text-center mt-32 text-slate-500 font-bold uppercase tracking-widest text-sm">ĐANG TẢI DANH SÁCH...</div>;

  return (
    <div className="font-sans bg-slate-50 min-h-screen pt-10 pb-20">
      <div className="max-w-[1100px] mx-auto px-4 flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        
        {/* ==========================================
            1. CỘT TRÁI: NÚT BACK (Desktop)
            ========================================== */}
        <div className="hidden lg:flex w-[60px] shrink-0 sticky top-28 flex-col items-center">
          <button 
            onClick={() => navigate('/company')} 
            title="Quay lại danh sách"
            className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm hover:-translate-x-1"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>

        {/* Nút Back (Mobile) */}
        <div className="lg:hidden w-full mb-2">
          <button onClick={() => navigate('/company')} className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            QUAY LẠI
          </button>
        </div>

        {/* ==========================================
            2. CỘT GIỮA: NỘI DUNG CHÍNH
            ========================================== */}
        <div className="flex-1 min-w-0 w-full">
          
          <div className="mb-8 border-b border-slate-200 pb-6">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Hồ Sơ Ứng Viên</h2>
            <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">
              MÃ CÔNG VIỆC: <span className="text-[#007db3]">#{jobId}</span> • TỔNG: {applicants.length} HỒ SƠ
            </p>
          </div>

          {applicants.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center shadow-sm">
              <p className="text-slate-900 font-black text-lg mb-2 uppercase tracking-widest">CHƯA CÓ ỨNG VIÊN NÀO</p>
              <p className="text-sm text-slate-500 font-medium">Danh sách hồ sơ nộp vào vị trí này hiện đang trống.</p>
            </div>
          ) : (
            <div className="space-y-5">
              {applicants.map((app) => {
                const profile = app.student?.StudentProfile || app.student?.StudentProfiles?.[0] || {};
                const fullName = profile.full_name || 'Chưa cập nhật tên';
                const email = app.student?.email || 'No email';
                const cvUrl = (app.cv_snapshot && app.cv_snapshot.startsWith('http')) ? app.cv_snapshot : null;
                
                const isPending = app.status === 'pending';
                const isAccepted = app.status === 'accepted';
                const isRejected = app.status === 'rejected';

                return (
                  <div key={app.id} className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 ${isAccepted ? 'border-emerald-200 bg-emerald-50/20' : isRejected ? 'border-red-200 bg-red-50/20' : 'border-slate-200'}`}>
                    
                    {/* 1. Thông tin sinh viên */}
                    <div className="flex items-start gap-5 flex-1">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black uppercase shrink-0 border shadow-sm ${isAccepted ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : isRejected ? 'bg-red-50 text-red-700 border-red-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                        {fullName.charAt(0)}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-black text-slate-900 leading-tight mb-1 uppercase">{fullName}</h3>
                        <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">{email}</p>
                        
                        <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                          {profile.university && <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 truncate max-w-[200px]">{profile.university}</span>}
                          {profile.major && <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">{profile.major}</span>}
                          {profile.gpa && <span className="bg-blue-50 text-[#007db3] px-2.5 py-1 rounded-md border border-blue-100">GPA: {profile.gpa}</span>}
                        </div>
                      </div>
                    </div>

                    {/* 2. Trạng thái & Link CV */}
                    <div className="flex flex-col items-start md:items-end gap-3 min-w-[140px] pl-4 md:border-l border-slate-100">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border
                        ${isPending ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
                        ${isAccepted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                        ${isRejected ? 'bg-red-50 text-red-700 border-red-200' : ''}
                      `}>
                        {isPending ? 'ĐANG CHỜ DUYỆT' : isAccepted ? 'ĐÃ CHẤP NHẬN' : 'ĐÃ TỪ CHỐI'}
                      </span>

                      {cvUrl ? (
                        <a href={cvUrl} target="_blank" rel="noreferrer" className="text-[#007db3] hover:text-blue-800 text-[11px] font-bold uppercase tracking-widest transition-colors flex items-center gap-1 bg-blue-50/50 px-3 py-1.5 rounded-md hover:bg-blue-100">
                          MỞ CV ĐÍNH KÈM ↗
                        </a>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">KHÔNG CÓ CV</span>
                      )}
                    </div>

                    {/* 3. Hành động (Duyệt/Từ chối) */}
                    <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                      <button 
                        onClick={() => handleUpdateStatus(app.student_id, 'accepted')}
                        disabled={isAccepted}
                        className={`flex-1 md:flex-none px-5 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all border shadow-sm ${isAccepted ? 'bg-emerald-600 text-white border-emerald-600 cursor-not-allowed shadow-inner' : 'bg-white text-emerald-700 hover:bg-emerald-50 border-emerald-200'}`}
                      >
                        {isAccepted ? 'ĐÃ NHẬN' : 'NHẬN'}
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(app.student_id, 'rejected')}
                        disabled={isRejected}
                        className={`flex-1 md:flex-none px-5 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all border shadow-sm ${isRejected ? 'bg-red-600 text-white border-red-600 cursor-not-allowed shadow-inner' : 'bg-white text-red-700 hover:bg-red-50 border-red-200'}`}
                      >
                        {isRejected ? 'ĐÃ LOẠI' : 'TỪ CHỐI'}
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ApplicantList;