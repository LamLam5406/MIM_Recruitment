import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jobApi } from '../../api/job.api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const CompanyJobs = () => {
  const [myJobs, setMyJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) fetchMyJobs();
  }, [user]);

  const fetchMyJobs = async () => {
    try {
      const response = await jobApi.getAllJobs(1, 50, { company_id: user.id }); 
      setMyJobs(response.jobs || []);
    } catch (error) {
      toast.error('Không thể tải danh sách việc làm!');
    } finally {
      setIsLoading(false);
    }
  };

  //HÀM XỬ LÝ XÓA BÀI ĐĂNG
  // const handleDelete = async (jobId) => {
  //   if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.")) {
  //     return;
  //   }

  //   try {
  //     await jobApi.deleteJob(jobId);
  //     toast.success('Đã xóa bài đăng thành công!');
  //     // Xóa item khỏi state nội bộ để cập nhật UI ngay lập tức mà không cần gọi lại API getAll
  //     setMyJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa bài đăng!');
  //   }
  // };
  const handleDelete = async (jobId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bài đăng này? Hành động này không thể hoàn tác.")) {
      return;
    }
    try {
      await jobApi.deleteJob(jobId);
      toast.success('Đã xóa bài đăng thành công!');
      setMyJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa bài đăng!');
    }
  };

  if (isLoading) return <div className="text-center mt-32 text-slate-500 font-bold uppercase tracking-widest text-sm">ĐANG TẢI DỮ LIỆU...</div>;

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Việc Làm Đã Đăng</h2>
          <div className="w-70 h-1.5 bg-[#007db3] rounded-full mt-3"></div>
        </div>
        <Link to="/company/post-job" className="bg-slate-900 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-[#007db3] transition-all text-xs uppercase tracking-wider shadow-md flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
          THÊM VIỆC LÀM MỚI
        </Link>
      </div>

      {/* Grid Danh sách việc */}
      {myJobs.length === 0 ? (
        <div className="text-center text-slate-500 py-16 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
          <p className="text-slate-900 font-black text-lg mb-2 uppercase tracking-widest">CHƯA CÓ CÔNG VIỆC NÀO</p>
          <p className="text-sm font-medium">Bạn chưa đăng tin tuyển dụng nào trên hệ thống.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myJobs.map((job) => {
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
                  <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-2 h-12 mb-3">
                    {job.title}
                  </h3>
                </div>

                <div className="flex flex-col gap-2 mb-6 flex-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 pb-2">
                    <span className="text-slate-400 uppercase tracking-widest">Hạn nộp</span>
                    <span className={`truncate text-right ${isClosed ? 'text-red-500' : 'text-slate-700'}`}>{job.deadline ? new Date(job.deadline).toLocaleDateString('vi-VN') : 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-semibold border-b border-slate-50 pb-2">
                    <span className="text-slate-400 uppercase tracking-widest">Hình thức</span>
                    <span className="text-[#007db3] truncate text-right uppercase">{job.job_type || 'FULL-TIME'}</span>
                  </div>
                </div>

                {/* Khu vực Nút thao tác */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-2">
                  <button 
                    onClick={() => navigate(`/company/jobs/${job.id}/applicants`)}
                    className="w-full py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest bg-blue-50 text-[#007db3] hover:bg-[#007db3] hover:text-white transition-all shadow-sm"
                  >
                    QUẢN LÝ ỨNG VIÊN &rarr;
                  </button>

                  <div className="flex gap-2">
                    {/* Nút Sửa: Giả định bạn sẽ tạo một Route là /company/edit-job/:id */}
                    <button 
                      onClick={() => navigate(`/company/jobs/${job.id}/edit`)}
                      className="flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-slate-200 transition-all border border-slate-200"
                    >
                      SỬA
                    </button>
                    
                    {/* Nút Xóa */}
                    <button 
                      onClick={() => handleDelete(job.id)}
                      className="flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all border border-red-100"
                    >
                      XÓA
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CompanyJobs;