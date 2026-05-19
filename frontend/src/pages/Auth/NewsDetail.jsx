import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { newsApi } from '../../api/news.api';
import { AuthContext } from '../../context/AuthContext';

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [news, setNews] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await newsApi.getNewsById(id);
        setNews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (isLoading) return <div className="text-center mt-32 text-slate-500 font-bold uppercase tracking-widest text-sm">ĐANG TẢI NỘI DUNG...</div>;
  if (!news) return <div className="text-center mt-32 text-red-500 font-black uppercase tracking-widest text-sm">KHÔNG TÌM THẤY BÀI VIẾT!</div>;

  const backLink = user?.role ? `/${user.role}/news` : '/news';

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8">
      
      {/* Nút Back thiết kế lại dạng UI hiện đại */}
      <div className="mb-8 flex items-center">
        <button 
          onClick={() => navigate(backLink)} 
          className="group inline-flex items-center gap-2 text-[11px] font-bold text-slate-500 hover:text-[#007db3] uppercase tracking-widest transition-colors bg-slate-100 hover:bg-blue-50 px-4 py-2 rounded-xl border border-transparent hover:border-blue-100"
        >
          <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          TRỞ VỀ DANH SÁCH
        </button>
      </div>
      
      {/* Tiêu đề Bài viết nhỏ hơn (text-2xl -> text-3xl) */}
      <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight uppercase">
        {news.title}
      </h1>
      
      {/* Khối Thông tin Tác giả */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-400 text-lg uppercase shadow-sm">
          {news.author?.charAt(0) || 'A'}
        </div>
        <div>
          <p className="text-xs font-black text-slate-900 uppercase tracking-wide">{news.author}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            ĐĂNG NGÀY {new Date(news.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>

      {/* Ảnh bìa */}
      {news.cover_image && (
        <div className="mb-10 w-full max-h-[400px] overflow-hidden rounded-2xl shadow-sm border border-slate-200">
          <img 
            src={news.cover_image} 
            alt={news.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Nội dung bài viết nhỏ hơn một chút (text-base) */}
      <div className="text-slate-800 leading-relaxed text-[15px] whitespace-pre-wrap font-medium pb-16">
        {news.content}
      </div>

    </div>
  );
};

export default NewsDetail;