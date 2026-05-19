import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { newsApi } from '../../api/news.api';
import toast from 'react-hot-toast';

const NewsForm = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({ title: '', content: '', author: 'Ban Quản Trị' });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      newsApi.getNewsById(id).then(data => {
        setFormData({ title: data.title, content: data.content, author: data.author });
      }).catch(() => toast.error('Không tải được thông tin bài viết cũ'));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('content', formData.content);
      payload.append('author', formData.author);
      if (file) payload.append('cover_image', file);

      if (isEditMode) {
        await newsApi.updateNews(id, payload);
        toast.success('Cập nhật thành công!');
      } else {
        await newsApi.createNews(payload);
        toast.success('Đăng bài thành công!');
      }
      navigate('/admin/news'); 
    } catch (error) {
      toast.error(error.response?.data?.error || 'Có lỗi xảy ra');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans max-w-[900px] mx-auto p-8 md:p-10 mt-8 bg-white rounded-3xl shadow-sm border border-slate-200">
      
      <div className="mb-10">
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          {isEditMode ? 'Chỉnh Sửa Tin Tức' : 'Đăng Tin Tức Mới'}
        </h2>
        <div className="w-12 h-1 bg-[#007db3] rounded-full mt-3"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Nhóm Thông tin chung */}
        <div className="space-y-6">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tiêu đề bài viết (*)</label>
            <input 
              type="text" 
              name="title" 
              required 
              value={formData.title} 
              onChange={handleChange} 
              placeholder="Nhập tiêu đề ấn tượng..." 
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Tác giả</label>
              <input 
                type="text" 
                name="author" 
                value={formData.author} 
                onChange={handleChange} 
                placeholder="Tên tác giả hoặc Ban quản trị"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-400" 
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Ảnh bìa minh họa</label>
              <div className="relative">
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#007db3]/10 file:text-[#007db3] hover:file:bg-[#007db3] hover:file:text-white file:transition-all file:cursor-pointer cursor-pointer border border-slate-200 rounded-xl bg-slate-50 pl-2 pr-4 py-1" 
                />
              </div>
              {isEditMode && !file && <p className="text-[10px] font-bold text-orange-500 mt-2 uppercase tracking-wide">Đang dùng ảnh bìa cũ. Chọn file mới để thay đổi.</p>}
            </div>
          </div>
        </div>

        {/* Nội dung */}
        <div>
          <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nội dung bài viết (*)</label>
          <textarea 
            name="content" 
            required 
            rows="12" 
            value={formData.content} 
            onChange={handleChange} 
            placeholder="Nội dung chi tiết của tin tức hoặc sự kiện..." 
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#007db3] focus:bg-white outline-none text-sm font-medium text-slate-800 transition-all placeholder:text-slate-400 leading-relaxed resize-y"
          ></textarea>
        </div>

        {/* Nút hành động */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 pt-6 border-t border-slate-100">
          <button 
            type="button" 
            onClick={() => navigate('/admin/news')} 
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit" 
            disabled={isLoading} 
            className={`w-full sm:w-auto px-10 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-[#007db3] transition-all text-xs tracking-widest uppercase shadow-md hover:shadow-blue-200/50 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'ĐANG XỬ LÝ...' : (isEditMode ? 'LƯU THAY ĐỔI' : 'ĐĂNG BÀI VIẾT')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewsForm;