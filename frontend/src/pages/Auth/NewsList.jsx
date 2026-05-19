import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { newsApi } from '../../api/news.api';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const NewsList = () => {
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await newsApi.getAllNews(1, 20);
      setNewsList(response.news || []);
    } catch (error) {
      toast.error('Không thể tải danh sách tin tức!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('BẠN CÓ CHẮC CHẮN MUỐN XÓA BÀI VIẾT NÀY?')) return;

    try {
      await newsApi.deleteNews(id);
      toast.success('Đã xóa bài viết!');
      fetchNews();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Lỗi khi xóa bài viết');
    }
  };

  const getDetailLink = (id) => user?.role ? `/${user.role}/news/${id}` : `/news/${id}`;

  if (isLoading) return <div className="text-center mt-32 text-slate-500 font-bold uppercase tracking-widest text-sm">ĐANG TẢI DỮ LIỆU...</div>;

  return (
    <div className="max-w-[1400px] w-full mx-auto px-4 py-8">

      {/* Header chỉ còn nút Thêm bài viết (Dành cho Admin) */}
      {user?.role === 'admin' && (
        <div className="flex justify-end mb-6">
          <Link to="/admin/news/create" className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-[#007db3] transition-all text-xs uppercase tracking-wider shadow-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"></path></svg>
            VIẾT BÀI MỚI
          </Link>
        </div>
      )}

      {/* Grid danh sách bé lại (Thêm cột, giảm gap) */}
      {newsList.length === 0 ? (
        <div className="text-center text-slate-500 py-16 bg-slate-50 border border-dashed border-slate-300 rounded-2xl">
          <p className="text-slate-900 font-black text-lg mb-2 uppercase">CHƯA CÓ BÀI VIẾT NÀO</p>
          <p className="text-xs font-medium">Hãy quay lại sau để cập nhật các tin tức mới nhất.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newsList.map((news) => (
            <div key={news.id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col">

              {/* Ảnh bìa nhỏ hơn (h-40 thay vì h-56) */}
              <div className="h-40 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                {news.cover_image ? (
                  <img
                    src={news.cover_image}
                    alt={news.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    CHƯA CÓ ẢNH BÌA
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/50 shadow-sm">
                  <p className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{new Date(news.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>

              {/* Nội dung Card padding nhỏ lại */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-[9px] text-[#007db3] mb-2 font-bold uppercase tracking-widest truncate">
                  ĐĂNG BỞI: {news.author}
                </p>
                <h3
                  className="text-base font-black text-slate-900 mb-3 leading-snug line-clamp-2 group-hover:text-[#007db3] transition-colors cursor-pointer"
                  onClick={() => navigate(getDetailLink(news.id))}
                  title={news.title}
                >
                  {news.title}
                </h3>
                <p className="text-slate-600 text-xs font-medium line-clamp-2 mb-5 flex-1 leading-relaxed">
                  {news.content}
                </p>

                {/* Footer Card */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                  <Link to={getDetailLink(news.id)} className="text-slate-900 text-[10px] font-black hover:text-[#007db3] transition-colors uppercase tracking-widest">
                    ĐỌC TIẾP &rarr;
                  </Link>

                  {user?.role === 'admin' && (
                    <div className="flex space-x-3">
                      <Link to={`/admin/news/edit/${news.id}`} className="text-slate-400 hover:text-yellow-600 text-[10px] font-bold uppercase tracking-widest transition-colors">SỬA</Link>
                      <button onClick={() => handleDelete(news.id)} className="text-slate-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-widest transition-colors">XÓA</button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsList;