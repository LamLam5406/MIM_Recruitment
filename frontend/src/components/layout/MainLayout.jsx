import React, { useState, useEffect } from 'react'; // Bổ sung thêm useEffect ở đây
import { Outlet, Link } from 'react-router-dom'; // Bỏ useNavigate đi vì Header mới không cần dùng nữa
import Logo from '../../assets/images/logofull.webp';
import address from '../../assets/images/address.webp';

// ==========================================
// 1. INTERNAL COMPONENT: HEADER
// ==========================================
const HeaderLayout = ({ user }) => {
  console.log("Thông tin user hiện tại:", user);
  
  // Đã xóa bỏ các khai báo showDropdown và navigate thừa thãi gây lỗi

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-slate-100 px-6 py-2 transition-all shadow-sm">
      <div className="max-w-[1500px] mx-auto w-full flex justify-between items-center">
        
        {/* Góc trái: Logo & Tên trường */}
        <div className="flex items-center gap-4 group">
          <div className="h-12 md:h-14 bg-white rounded-lg p-1">
            <img 
              src={Logo} 
              alt="Logo HUS" 
              className="h-full w-auto object-contain" 
            />
          </div>
          <div className="hidden sm:block mt-1">
            <small className="text-[#007db3] tracking-widest text-xs font-semibold block mb-0.5 uppercase">
              Đại học Quốc gia Hà Nội
            </small>
            <h2 className="m-0 text-[#007db3] text-lg md:text-xl font-extrabold uppercase tracking-tight">
              Trường Đại học Khoa học Tự nhiên
            </h2>
          </div>
        </div>

        {/* Góc phải: Đăng nhập/User */}
        <div>
          {user ? (
            // Trạng thái đã đăng nhập: Hiển thị Thứ, Ngày Tháng Năm (Giữ nguyên của bạn)
            <div className="flex items-center gap-2.5 select-none bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shadow-sm text-[#007db3]">
              {/* Icon Lịch (Calendar) */}
              <svg 
                className="w-5 h-5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              
              {/* Chuỗi ngày tháng tự động lấy theo giờ hệ thống */}
              <span className="font-bold text-sm capitalize">
                {new Intl.DateTimeFormat('vi-VN', { 
                  weekday: 'long', 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                }).format(new Date())}
              </span>
            </div>
          ) : (
            // Trạng thái chưa đăng nhập
            <Link 
              to="/login" 
              className="bg-[#007db3] text-white px-7 py-2.5 rounded-full font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200/50 transition-all active:scale-95 text-sm"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

// ==========================================
// 2. INTERNAL COMPONENT: FOOTER
// ==========================================
const FooterLayout = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16 mt-auto border-t border-slate-800 font-sans">
      <div className="max-w-[1500px] mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Cột 1: Logo / Map (Chiếm 4 phần) */}
        <div className="md:col-span-5 flex flex-col items-start ml-4">
          <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b-2 border-[#007db3] inline-block uppercase tracking-wide">
            Trường Đại học Khoa học Tự nhiên
          </h3>
          <a 
            href="https://www.google.com/maps?q=334+Nguyễn+Trãi+Thanh+Xuân+Hà+Nội" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="block w-full max-w-md hover:opacity-80 transition-opacity"
          >
            <img 
              src={address}
              alt="Bản đồ chỉ đường HUS" 
              className="w-full object-contain rounded-lg border border-slate-700 shadow-md" 
            />
          </a>
        </div>

        {/* Cột 2: Thông tin liên hệ (Chiếm 5 phần) */}
        <div className="md:col-span-4">
          <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b-2 border-[#007db3] inline-block uppercase tracking-wide">
            Thông tin liên hệ
          </h3>
          <div className="space-y-4 text-sm leading-relaxed text-slate-400">
            <p className="flex items-start gap-3">
              <span className="text-xl">📍</span> 
              <span>334 Nguyễn Trãi - Thanh Xuân - Hà Nội</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="text-xl">📞</span> 
              <span>(84) 0243-8584615 / 8581419</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="text-xl">📠</span> 
              <span>(84) 0243-8523061</span>
            </p>
            <p className="flex items-center gap-3">
              <span className="text-xl">📧</span> 
              <span>hus@vnu.edu.vn - admin@hus.edu.vn</span>
            </p>
          </div>
        </div>

        {/* Cột 3: Mạng xã hội (Chiếm 3 phần) */}
        <div className="md:col-span-3">
          <h3 className="text-lg font-bold text-white mb-6 pb-2 border-b-2 border-[#007db3] inline-block uppercase tracking-wide">
            Mạng xã hội
          </h3>
          <ul className="space-y-4">
            <li>
              <a 
                href="https://www.facebook.com/HusFanpage/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-slate-400 hover:text-[#007db3] transition-colors font-medium text-sm"
              >
                <span className="text-lg">🔗</span> Fanpage Trường ĐHKHTN
              </a>
            </li>
            <li>
              <a 
                href="https://www.facebook.com/VNUHUSFanpage/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-slate-400 hover:text-[#007db3] transition-colors font-medium text-sm"
              >
                <span className="text-lg">🔗</span> Fanpage Tư vấn Tuyển sinh
              </a>
            </li>
          </ul>
        </div>
        
      </div>

      {/* Dòng Bản Quyền */}
      <div className="max-w-[1500px] mx-auto px-6 mt-12 pt-8 border-t border-slate-800 text-center">
        <p className="text-slate-500 text-sm font-medium">
          Bản quyền © {new Date().getFullYear()} Trường ĐHKHTN-ĐHQGHN.
        </p>
      </div>
    </footer>
  );
};

// ==========================================
// 3. EXPORT DEFAULT COMPONENT: MAIN LAYOUT
// ==========================================
const MainLayout = ({ user }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Theo dõi vị trí cuộn trang
  useEffect(() => {
    const toggleVisibility = () => {
      // Nếu cuộn xuống quá 300px thì hiện nút
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    // Clean up listener khi component unmount
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Hàm xử lý cuộn lên đầu mượt mà
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth" // Hiệu ứng cuộn mượt
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans relative">
      
      {/* Header */}
      <HeaderLayout user={user} />
      
      {/* Dynamic Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <FooterLayout />

      {/* --- NÚT CUỘN LÊN ĐẦU TRANG --- */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 bg-[#007db3] text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Cuộn lên đầu trang"
        title="Lên đầu trang"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      </button>
      
    </div>
  );
};

export default MainLayout;