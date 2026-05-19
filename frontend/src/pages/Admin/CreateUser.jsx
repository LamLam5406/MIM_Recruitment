import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import toast from 'react-hot-toast';

const ManageUsers = () => {
  // State quản lý danh sách & UI
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [showForm, setShowForm] = useState(false); // Toggle form modal
  const [editingId, setEditingId] = useState(null);

  // State tìm kiếm & lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // State form
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student',
    full_name: '',
    company_name: '',
    description: ''
  });

  const fetchUsers = async () => {
    setIsFetching(true);
    try {
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Không thể tải danh sách tài khoản!');
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      email: user.email,
      password: '',
      role: user.role,
      full_name: user.StudentProfile?.full_name || '',
      company_name: user.CompanyProfile?.company_name || '',
      description: user.CompanyProfile?.description || ''
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ email: '', password: '', role: 'student', full_name: '', company_name: '', description: '' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return;
    try {
      await adminApi.deleteUser(id);
      toast.success('Xóa tài khoản thành công!');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi xóa tài khoản!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = { email: formData.email, role: formData.role };
      if (formData.password) payload.password = formData.password;

      if (editingId) {
        await adminApi.updateUser(editingId, payload);
        toast.success('Cập nhật tài khoản thành công!');
      } else {
        if (formData.role === 'student') payload.full_name = formData.full_name;
        if (formData.role === 'company') {
          payload.company_name = formData.company_name;
          payload.description = formData.description;
        }
        await adminApi.createUser(payload);
        toast.success('Tạo tài khoản thành công!');
      }
      handleCancel();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra!');
    } finally {
      setIsLoading(false);
    }
  };

  // Logic lọc dữ liệu tại phía Client
  const filteredUsers = users.filter(user => {
    const searchMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       (user.StudentProfile?.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                       (user.CompanyProfile?.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = roleFilter === '' || user.role === roleFilter;
    return searchMatch && roleMatch;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10 font-sans relative">
      
      {/* HEADER PAGE */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-slate-200 pb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Quản Lý Tài Khoản</h2>
          <div className="w-75 h-1.5 bg-[#007db3] rounded-full mt-3"></div>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-[#007db3] transition-all shadow-lg flex items-center gap-2 uppercase text-xs tracking-widest"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
          Tạo tài khoản mới
        </button>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC (Phong cách JobList) */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2.5 mb-8 flex flex-col sm:flex-row gap-3 items-center">
        <div className="flex-1 w-full relative flex items-center bg-slate-50 rounded-xl px-2 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
          <svg className="w-5 h-5 text-[#007db3] absolute left-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Tìm theo email, tên sinh viên hoặc công ty..." 
            className="w-full pl-9 pr-3 py-3 bg-transparent border-none focus:ring-0 text-slate-800 outline-none text-sm font-semibold placeholder-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select 
            className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 outline-none focus:ring-2 focus:ring-blue-100"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="student">Sinh viên</option>
            <option value="company">Doanh nghiệp</option>
            <option value="admin">Quản trị viên</option>
          </select>
        </div>
      </div>

      {/* GRID DANH SÁCH TÀI KHOẢN (Phong cách AdminJobs) */}
      {isFetching ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white h-48 rounded-2xl border border-slate-100 animate-pulse shadow-sm"></div>
          ))}
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center text-slate-500 py-20 bg-slate-50 border border-dashed border-slate-300 rounded-3xl">
          <p className="font-black text-lg uppercase tracking-widest text-slate-400">Không tìm thấy tài khoản nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredUsers.map((u) => (
            <div key={u.id} className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${u.role === 'admin' ? 'bg-red-500' : u.role === 'company' ? 'bg-purple-500' : 'bg-emerald-500'}`}></div>
              
              <div className="mb-4">
                <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                  u.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 
                  u.role === 'company' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                  'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {u.role}
                </span>
                <h3 className="mt-3 text-sm font-black text-slate-900 break-all leading-tight mb-1" title={u.email}>
                  {u.email}
                </h3>
                <p className="text-[#007db3] text-[11px] font-bold uppercase tracking-tight truncate">
                  {u.role === 'student' ? (u.StudentProfile?.full_name || 'Chưa cập nhật tên') : 
                   u.role === 'company' ? (u.CompanyProfile?.company_name || 'Chưa cập nhật công ty') : 'Administrator'}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-slate-50 flex gap-2">
                <button 
                  onClick={() => handleEdit(u)}
                  disabled={u.role === 'admin' && u.email !== 'admin@gmail.com'} // Chặn sửa admin khác
                  className="flex-1 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest bg-slate-50 text-slate-600 hover:bg-amber-50 hover:text-amber-600 transition-all border border-slate-100"
                >
                  Sửa
                </button>
                <button 
                  onClick={() => handleDelete(u.id)}
                  disabled={u.role === 'admin'}
                  className="flex-1 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all border border-red-100"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FORM MODAL (Lớp phủ khi click Tạo/Sửa) */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up border border-white/20">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                    {editingId ? 'Cập nhật tài khoản' : 'Tạo mới người dùng'}
                  </h2>
                  <div className={`w-10 h-1 rounded-full mt-2 ${editingId ? 'bg-amber-500' : 'bg-[#007db3]'}`}></div>
                </div>
                <button onClick={handleCancel} className="text-slate-400 hover:text-red-500 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email đăng nhập</label>
                    <input
                      type="email" name="email" required
                      value={formData.email} onChange={handleChange}
                      placeholder="user@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none text-sm font-semibold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mật khẩu</label>
                    <input
                      type="password" name="password" 
                      required={!editingId} minLength={6}
                      value={formData.password} onChange={handleChange}
                      placeholder={editingId ? "Để trống nếu không đổi" : "Tối thiểu 6 ký tự"}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:bg-white outline-none text-sm font-semibold"
                    />
                  </div>
                </div>

                <div className="py-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 ml-1">Vai trò hệ thống</label>
                  <div className="flex gap-4">
                    {['student', 'company'].map((r) => (
                      <label key={r} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${formData.role === r ? 'bg-blue-50 border-[#007db3] text-[#007db3]' : 'bg-white border-slate-200 text-slate-500'} ${editingId ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <input type="radio" name="role" value={r} checked={formData.role === r} onChange={handleChange} disabled={!!editingId} className="hidden" />
                        <span className="text-xs font-black uppercase tracking-widest">{r === 'student' ? 'Sinh viên' : 'Công ty'}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Phần thông tin bổ sung khi tạo mới */}
                {!editingId && (
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                    {formData.role === 'student' ? (
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Họ và tên sinh viên</label>
                        <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none text-sm font-semibold" />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Tên doanh nghiệp</label>
                          <input type="text" name="company_name" value={formData.company_name} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none text-sm font-semibold" />
                        </div>
                        <div>
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1.5 ml-1">Mô tả ngắn</label>
                          <textarea name="description" rows={2} value={formData.description} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none text-sm font-semibold resize-none" />
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={handleCancel} className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all text-xs tracking-widest uppercase">
                    Đóng
                  </button>
                  <button
                    type="submit" disabled={isLoading}
                    className={`flex-[2] py-3.5 text-white font-bold rounded-xl transition-all text-xs tracking-widest uppercase shadow-lg shadow-blue-200 ${isLoading ? 'bg-slate-400' : 'bg-slate-900 hover:bg-[#007db3]'}`}
                  >
                    {isLoading ? 'Đang xử lý...' : (editingId ? 'Xác nhận cập nhật' : 'Hoàn tất tạo tài khoản')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;