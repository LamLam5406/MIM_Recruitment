import { useContext } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// 1. Cấu hình giao diện và đường dẫn cho từng role
const layoutConfig = {
  admin: {
    title: 'Cổng Quản Trị',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
      </svg>
    ),
    links: [
      { path: '/admin/intro', label: 'Giới thiệu' },
      { path: '/admin/news', label: 'Tin tức' },
      { path: '/admin/jobs', label: 'Tuyển dụng' },
      { path: '/admin', label: 'Quản lý' },
      { path: '/admin/contact', label: 'Liên hệ' },
    ],
    showProfileLink: false,
  },
  company: {
    title: 'Cổng Doanh Nghiệp',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      </svg>
    ),
    links: [
      { path: '/company/intro', label: 'Giới thiệu' },
      { path: '/company/news', label: 'Tin tức' },
      { path: '/company', label: 'Tuyển Dụng' },
      { path: '/company/contact', label: 'Liên hệ' },
    ],
    profilePath: '/company/profile',
    showProfileLink: true,
  },
  student: {
    title: 'Cổng sinh viên',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
      </svg>
    ),
    links: [
      { path: '/student/intro', label: 'Giới thiệu' },
      { path: '/student/news', label: 'Tin tức' },
      { path: '/student', label: 'Tuyển dụng' },
      { path: '/student/contact', label: 'Liên hệ' },
    ],
    profilePath: '/student/profile',
    showProfileLink: true,
  }
};

// 2. Component chính nhận prop `role` ('admin', 'company', 'student')
const PortalLayout = ({ role }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    // XÓA LỊCH SỬ APPLY TRONG LOCAL STORAGE KHI ĐĂNG XUẤT
    localStorage.removeItem('uniconnect_applied_jobs'); 
    
    logout();
    navigate('/login');
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return `transition duration-200 pb-0 ${
      isActive 
        ? 'text-white font-bold border-b-2 border-white' 
        : 'text-gray-100 font-bold hover:text-white'
    }`;
  };

  // Lấy cấu hình dựa trên role hiện tại (mặc định là student nếu truyền sai)
  const currentConfig = layoutConfig[role] || layoutConfig.student;

  return (
    <div className="flex flex-col min-h-screen w-full font-sans bg-gray-50">
      <header className="bg-[#007db3] shadow-md px-6 py-3 flex justify-between items-center text-white z-40 sticky top-0">
        
        {/* --- 1. TRÁI: Tiêu đề --- */}
        <div className="flex items-center w-1/4">
          <div className="text-xl font-extrabold tracking-wide flex items-center gap-2 cursor-default text-blue-200">
            {currentConfig.icon}
            {currentConfig.title}
          </div>
        </div>
        
        {/* --- 2. GIỮA: Menu Điều Hướng --- */}
        <nav className="hidden md:flex justify-start items-center space-x-12 text-lg w-2/4 pr-20">
          {currentConfig.links.map((link, index) => (
            <Link key={index} to={link.path} className={getLinkClass(link.path)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* --- 3. PHẢI: Hành động của người dùng --- */}
        <div className="flex justify-end items-center space-x-2 w-1/4">
          
          {/* Nút Hồ Sơ hoặc text Admin */}
          {currentConfig.showProfileLink ? (
            <Link 
              to={currentConfig.profilePath} 
              className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-md transition text-sm font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span className="hidden lg:inline">Hồ sơ</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md transition text-sm font-medium text-white/90 cursor-default">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span className="hidden lg:inline">Admin</span>
            </div>
          )}

          {/* Vách ngăn | */}
          <span className="text-white/30 mx-1">|</span>
          
          {/* Nút Đăng Xuất */}
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-md transition text-sm font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span>Thoát</span>
          </button>
        </div>

      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-[1400px] mx-auto w-full">
        <Outlet /> 
      </main>
    </div>
  );
};

export default PortalLayout;