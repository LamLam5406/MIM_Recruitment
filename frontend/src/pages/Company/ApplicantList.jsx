import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { jobApi } from '../../api/job.api';
import { interviewApi } from '../../api/interview.api';
import toast from 'react-hot-toast';

const ApplicantList = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States cho tính năng gửi email
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [emailSubject, setEmailSubject] = useState('Thư mời phỏng vấn - UniConnect');
  const [emailContent, setEmailContent] = useState('Chào [TEN],\n\nChúc mừng bạn đã vượt qua vòng duyệt hồ sơ. Chúng tôi trân trọng mời bạn tham gia buổi phỏng vấn trực tuyến vào lúc...');

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

  const handleSendInterviewEmails = async () => {
    if (!emailSubject.trim() || !emailContent.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung email');
      return;
    }

    // 1. Lọc danh sách các ứng viên hợp lệ (đã chấp nhận & có email)
    const acceptedApps = applicants.filter(app => app.status === 'accepted' && app.student?.email);

    if (acceptedApps.length === 0) {
      toast.error('Không tìm thấy địa chỉ email hợp lệ của ứng viên.');
      return;
    }

    setIsSending(true);
    try {
      // 2. Sử dụng Promise.all để gửi email cá nhân hóa cho từng người cùng lúc
      const sendPromises = acceptedApps.map(app => {
        const profile = app.student?.StudentProfile || app.student?.StudentProfiles?.[0] || {};
        const applicantName = profile.full_name || 'Ứng viên';
        const applicantEmail = app.student.email;

        // Thay thế cú pháp [TEN] bằng tên thật của sinh viên
        const personalizedContent = emailContent.replace(/\[TEN\]/g, applicantName);

        // Gọi API (chú ý: backend vẫn đang nhận mảng emails, nên ta bọc email vào mảng 1 phần tử)
        return interviewApi.sendInvites([applicantEmail], emailSubject, personalizedContent);
      });

      await Promise.all(sendPromises);
      
      toast.success(`Thành công: Đã gửi thư mời tới ${acceptedApps.length} ứng viên!`);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Không thể gửi email lúc này');
    } finally {
      setIsSending(false);
    }
  };

  // Hàm hỗ trợ chèn nhanh từ khóa [TEN] vào text box
  const insertNameTag = () => {
    setEmailContent(prev => prev + ' [TEN]');
  };

  const acceptedApplicantsCount = applicants.filter(app => app.status === 'accepted').length;

  if (isLoading) return <div className="text-center mt-32 text-slate-500 font-bold uppercase tracking-widest text-sm">ĐANG TẢI DANH SÁCH...</div>;

  return (
    <div className="font-sans bg-slate-50 min-h-screen pt-10 pb-20 relative">
      <div className="max-w-[1100px] mx-auto px-4 flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
        
        {/* NÚT QUAY LẠI */}
        <div className="hidden lg:flex w-[60px] shrink-0 sticky top-28 flex-col items-center">
          <button onClick={() => navigate('/company')} title="Quay lại danh sách" className="w-12 h-12 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition-all shadow-sm hover:-translate-x-1">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
        </div>
        <div className="lg:hidden w-full mb-2">
          <button onClick={() => navigate('/company')} className="inline-flex items-center text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg> QUAY LẠI
          </button>
        </div>

        {/* NỘI DUNG CHÍNH */}
        <div className="flex-1 min-w-0 w-full">
          <div className="mb-8 border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Hồ Sơ Ứng Viên</h2>
              <p className="text-xs text-slate-500 mt-2 font-bold uppercase tracking-widest">
                MÃ CÔNG VIỆC: <span className="text-[#007db3]">#{jobId}</span> • TỔNG: {applicants.length} HỒ SƠ
              </p>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              disabled={acceptedApplicantsCount === 0}
              className={`px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all border shadow-sm flex items-center gap-2
                ${acceptedApplicantsCount > 0 ? 'bg-[#007db3] text-white border-[#007db3] hover:bg-blue-800' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              SOẠN LỊCH PHỎNG VẤN ({acceptedApplicantsCount})
            </button>
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
                
                // FIX LỖI HIỂN THỊ LINK CV
                // Lấy cv_snapshot (nếu có) hoặc cv_url từ profile sinh viên
                const rawCvUrl = app.cv_snapshot || profile.cv_url;
                
                // Nếu đường dẫn là dạng tương đối (/uploads/...), tự động nối với domain của backend
                const cvUrl = rawCvUrl 
                  ? (rawCvUrl.startsWith('http') ? rawCvUrl : `http://localhost:3000${rawCvUrl.startsWith('/') ? '' : '/'}${rawCvUrl}`)
                  : null;
                
                const isPending = app.status === 'pending';
                const isAccepted = app.status === 'accepted';
                const isRejected = app.status === 'rejected';

                return (
                  <div key={app.id} className={`bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6 ${isAccepted ? 'border-emerald-200 bg-emerald-50/20' : isRejected ? 'border-red-200 bg-red-50/20' : 'border-slate-200'}`}>
                    
                    {/* Thông tin sinh viên */}
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

                    {/* Trạng thái & Link CV */}
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

                    {/* Hành động */}
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

      {/* MODAL GỬI EMAIL PHỎNG VẤN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-8 shadow-2xl flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Soạn Thông Báo Phỏng Vấn</h3>
                <p className="text-xs text-slate-500 mt-1 font-bold uppercase tracking-widest">
                  GỬI ĐẾN {acceptedApplicantsCount} ỨNG VIÊN ĐÃ ĐƯỢC CHẤP NHẬN
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-800 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 pr-2">
              <div>
                <label className="block text-[11px] font-black text-slate-700 mb-2 uppercase tracking-widest">Tiêu Đề Email</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#007db3] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-900"
                  placeholder="Nhập tiêu đề..."
                />
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-[11px] font-black text-slate-700 uppercase tracking-widest">Nội Dung Chi Tiết</label>
                  <button 
                    onClick={insertNameTag}
                    className="text-[10px] font-bold bg-blue-50 text-[#007db3] px-2 py-1 rounded hover:bg-blue-100 transition-colors border border-blue-100 uppercase tracking-wider"
                  >
                    + Chèn [TEN] ứng viên
                  </button>
                </div>
                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows="8"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#007db3] focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium text-slate-900 resize-none leading-relaxed"
                  placeholder="Nhập nội dung thư mời phỏng vấn..."
                ></textarea>
                <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">
                  * Hệ thống sẽ gửi email riêng biệt và tự động thay thế từ khóa <span className="text-[#007db3] bg-blue-50 px-1 rounded">[TEN]</span> bằng tên thật của từng sinh viên.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3 justify-end">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                HỦY BỎ
              </button>
              <button 
                onClick={handleSendInterviewEmails}
                disabled={isSending}
                className="px-8 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest transition-all bg-[#007db3] text-white hover:bg-blue-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shadow-md"
              >
                {isSending ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN GỬI'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ApplicantList;