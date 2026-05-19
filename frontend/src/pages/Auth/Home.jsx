import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsApi } from '../../api/news.api';
import icon1 from '../../assets/icons/icon1.svg';
import icon2 from '../../assets/icons/icon2.svg';
import icon3 from '../../assets/icons/icon3.svg';
import icon4 from '../../assets/icons/icon4.svg';
import school from '../../assets/images/school.webp';
import leader from '../../assets/images/leader.webp';

// --- SUB-COMPONENTS ---
const SectionHeading = ({ title, subtitle }) => (
  <div className="text-center mb-14">
    <h2 className="text-3xl md:text-4xl text-slate-800 font-extrabold uppercase tracking-tight mb-4">
      {title}
    </h2>
    <div className="w-20 md:w-32 h-1.5 bg-[#007db3] mx-auto rounded-full mb-4"></div>
    {subtitle && <p className="text-slate-500 text-lg max-w-2xl mx-auto">{subtitle}</p>}
  </div>
);

const FeatureItem = ({ iconSrc, title, desc }) => (
  <div className="group bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1 text-center">
    <div className="mx-auto w-20 h-20 rounded-xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
      <img src={iconSrc} alt="icon" className="w-12 h-12 object-contain" />
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">
      {desc}
    </p>
  </div>
);

const CardItem = ({ image, date, title, link, tag }) => (
  <div className="group bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
    
    <div className="h-[200px] overflow-hidden relative">
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
      <img 
        src={image} 
        alt={title} 
        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" 
      />

      {tag && (
        <span className="absolute top-3 right-3 z-20 bg-gradient-to-r from-[#007db3] to-blue-500 text-white px-3 py-1 text-[11px] font-bold rounded-full shadow tracking-wide">
          {tag}
        </span>
      )}
    </div>

    <div className="p-5 flex flex-col flex-grow">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p className="text-xs text-slate-500 font-medium">{date}</p>
      </div>

      <h3 className="text-lg font-bold mb-3 leading-snug text-slate-800 line-clamp-2 group-hover:text-[#007db3] transition-colors">
        <Link to={link}>{title}</Link>
      </h3>

      <div className="mt-auto pt-3 border-t border-slate-50">
        <Link to={link} className="inline-flex items-center text-[#007db3] font-semibold text-xs uppercase group-hover:gap-2 transition-all">
          Xem chi tiết
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
          </svg>
        </Link>
      </div>

    </div>
  </div>
);

// --- MAIN PAGE ---
const Home = () => {
  // 1. Thêm State lưu tin tức
  const [latestNews, setLatestNews] = useState([]);

  // 2. Thêm hàm gọi API lấy 3 tin mới nhất
  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        // Lấy trang 1, giới hạn 3 bài viết
        const response = await newsApi.getAllNews(1, 3);
        setLatestNews(response.news || []);
      } catch (error) {
        console.error('Không thể tải tin tức trang chủ:', error);
      }
    };
    fetchLatestNews();
  }, []);

  return (
    <div className="selection:bg-blue-200 selection:text-blue-900 w-full">
      
      {/* --- SECTION 1: HERO BANNER --- */}
      <section className="relative w-full h-[500px] md:h-[650px] flex items-center justify-center">
        <div className="absolute inset-0">
          <img 
            src={school} 
            alt="HUS Campus" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/70 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Kết Nối Tri Thức, <br/>Kiến Tạo Tương Lai
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-10 leading-relaxed font-light">
              Nền tảng giúp sinh viên tiếp cận cơ hội việc làm từ các doanh nghiệp uy tín.
            </p>
            <div className="flex gap-4">
              <Link to="/login" className="bg-[#007db3] text-white px-8 py-3.5 rounded-full font-bold hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30">
                Khám phá ngay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- SECTION 2: VÌ SAO CHỌN HUS? --- */}
      <section className="py-24 px-6 bg-slate-100">
        <div className="max-w-7xl mx-auto">
          <SectionHeading 
            title="Vì sao chọn chúng tôi" 
            subtitle="Trường Đại học Khoa học Tự nhiên là trung tâm đào tạo, nghiên cứu khoa học và công nghệ đa lĩnh vực, cung cấp nguồn nhân lực chất lượng cao cho xã hội."
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <FeatureItem 
              iconSrc={icon1} 
              title="Học liệu khổng lồ"
              desc="Truy cập hàng ngàn luận văn, luận án và công trình nghiên cứu khoa học độc quyền." 
            />
            <FeatureItem 
              iconSrc={icon2} 
              title="Mạng lưới đối tác"
              desc="Kết nối trực tiếp với mạng lưới doanh nghiệp và nhà tuyển dụng uy tín trong, ngoài nước." 
            />
            <FeatureItem 
              iconSrc={icon3} 
              title="Trải nghiệm thực tế"
              desc="Tạo cơ hội tiếp cận sớm với môi trường chuyên nghiệp khi còn ngồi trên ghế nhà trường." 
            />
            <FeatureItem 
              iconSrc={icon4} 
              title="Nghiên cứu sáng tạo"
              desc="Khuyến khích và hỗ trợ tối đa tinh thần nghiên cứu, đổi mới sáng tạo trong sinh viên." 
            />
          </div>
        </div>
      </section>

      {/* --- SECTION 3: THÔNG ĐIỆP TỪ BAN QUẢN LÝ --- */}
      <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 transform skew-x-12 translate-x-32 z-0 hidden lg:block"></div>
        
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
          {/* Image */}
          <div className="w-full md:w-5/12">
            <div className="relative">
              <div className="absolute inset-0 bg-[#007db3] rounded-3xl transform translate-x-4 translate-y-4 opacity-20"></div>
              <img src={leader} alt="Director" className="rounded-3xl shadow-2xl relative z-10 w-full object-cover aspect-[4/5]" />
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full md:w-7/12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-1 bg-[#007db3] rounded-full"></span>
              <h2 className="text-[#007db3] font-bold tracking-widest uppercase text-sm">
                Thông điệp từ Ban Giám Hiệu
              </h2>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold mb-8 text-slate-800 leading-tight">
              Chào mừng bạn đến với <br className="hidden md:block" />
              <span className="text-[#007db3]">Trường ĐH Khoa học Tự nhiên</span>
            </h3>
            
            <blockquote className="relative p-6 border-l-4 border-[#007db3] bg-slate-50 text-slate-700 italic text-lg leading-relaxed mb-8 rounded-r-lg">
              "Mang trong mình sứ mệnh “đào tạo nguồn nhân lực chất lượng cao, bồi dưỡng nhân tài, nghiên cứu sáng tạo và chuyển giao tri thức thuộc lĩnh vực khoa học và công nghệ, góp phần xây dựng, phát triển và bảo vệ đất nước”, Nhà trường đã nỗ lực không ngừng trong đổi mới giáo dục, phát triển đa dạng các chương trình đào tạo, đầu tư cho nghiên cứu khoa học và đổi mới sáng tạo, phát hiện, đào tạo và bồi dưỡng những tài năng cho đất nước."
            </blockquote>
            
          </div>
        </div>
      </section>

      {/* --- SECTION 4: TIN TỨC & SỰ KIỆN --- */}
      <section className="py-24 px-6 bg-slate-100">
        <div className="max-w-6xl mx-auto">

          {/* Title */}
          <div className="flex flex-col items-center text-center">
            <SectionHeading
              title="Tin tức & Sự kiện"
              subtitle="Cập nhật liên tục những thông tin mới nhất về hoạt động học thuật, các hội thảo chuyên ngành và những chương trình ngoại khóa nổi bật dành cho sinh viên."
            />
          </div>

          {/* Dùng Array.map để render danh sách Card tự động */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15">
            {latestNews.length > 0 ? (
              latestNews.map((news, index) => {
                // Xử lý link ảnh: Nếu có ảnh cover thì nối VITE_API_URL, nếu không thì dùng ảnh mặc định
                const imageUrl = news.cover_image 
                  ? `${import.meta.env.VITE_API_URL.replace('/api', '')}/${news.cover_image}` 
                  : `https://via.placeholder.com/600x400?text=News+${index + 1}`;

                return (
                  <CardItem
                    key={news.id}
                    image={imageUrl}
                    date={new Date(news.createdAt).toLocaleDateString('vi-VN')}
                    title={news.title}
                    // Tạm trỏ về login vì public chưa có trang xem chi tiết tin
                    link={`/login`} 
                    tag={index === 0 ? "Mới nhất" : null} // Đánh dấu thẻ đầu tiên là Mới nhất
                  />
                )
              })
            ) : (
              <div className="col-span-3 text-center text-slate-500">Đang tải tin tức...</div>
            )}
          </div>

          {/* Button */}
          <div className="flex justify-center mt-10">
            {/* Sửa link thành /login tạm thời */}
            <Link
              to="/login"
              className="inline-flex items-center gap-2 border-2 border-[#007db3] text-[#007db3] px-6 py-2.5 rounded-full font-semibold hover:bg-[#007db3] hover:text-white transition-all"
            >
              Xem tất cả tin tức
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>

        </div>
      </section>
      
    </div>
  );
};

export default Home;