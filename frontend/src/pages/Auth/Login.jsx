import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authApi } from '../../api/auth.api';
import toast from 'react-hot-toast';
import school from '../../assets/images/school.webp';

// --- SUB-COMPONENT: Custom Input Field ---
const InputField = ({ label, icon, showPasswordToggle, isPasswordVisible, onTogglePassword, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-6">
      <label className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${isFocused ? 'text-[#007db3]' : 'text-slate-700'}`}>
        {label}
      </label>
      <div className="relative group">
        {/* Left Icon */}
        <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200 ${isFocused ? 'text-[#007db3]' : 'text-slate-400 group-hover:text-slate-500'}`}>
          {icon}
        </div>
        
        {/* Input */}
        <input
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-11 pr-12 py-3.5 border border-slate-200 rounded-xl bg-white text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-100 focus:border-[#007db3] transition-all duration-200 shadow-inner group-hover:border-slate-300"
        />

        {/* Right Icon - Password Toggle */}
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#007db3] transition-colors"
            tabIndex="-1"
          >
            {isPasswordVisible ? (
              // Icon Eye Off
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path>
              </svg>
            ) : (
              // Icon Eye
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT: Login ---
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authApi.login(email, password);
      login(response.token, { id: response.user.id, role: response.user.role, email: response.user.email });
      
      toast.success('Đăng nhập thành công!');

      if (response.user.role === 'admin') navigate('/admin');
      else if (response.user.role === 'company') navigate('/company');
      else navigate('/student');

    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Đăng nhập thất bại. Vui lòng thử lại!';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="selection:bg-blue-200 selection:text-blue-900 min-h-screen bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Nút Back về Home nổi góc trái */}
      <div className="absolute top-6 left-6 z-50">
        <Link 
          to="/" 
          className="group flex items-center gap-2 text-slate-500 hover:text-[#007db3] transition-all font-medium bg-white/80 backdrop-blur-md px-4 py-2.5 rounded-full shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100"
        >
          <svg 
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span className="hidden sm:inline">Về trang chủ</span>
        </Link>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white transform skew-x-12 translate-x-40 z-0 hidden lg:block"></div>
      
      {/* Background image overlay */}
      <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
          <img src={school} alt="background" className="w-full h-full object-cover" />
      </div>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side - Text & Brading */}
        <div className="hidden lg:block lg:col-span-7 pr-12">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-1.5 bg-[#007db3] rounded-full"></div>
                {/* Text HUS Platform giờ là link bấm về Home */}
                <Link to="/" className="text-xl font-bold text-[#007db3] uppercase tracking-widest hover:text-blue-700 transition-colors cursor-pointer">
                    HUS Platform
                </Link>
            </div>
            <h2 className="text-5xl font-extrabold text-slate-900 leading-tight mb-6">
                Hệ thống quản lý <br/> <span className="text-[#007db3]">Đồ án & Việc làm</span>
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                Chào mừng bạn quay trở lại. Vui lòng đăng nhập với tài khoản được cấp để truy cập hệ thống học liệu và kết nối doanh nghiệp.
            </p>
        </div>

        {/* Right Side - Login Form Card */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end mt-12 lg:mt-0">
          <div className="bg-white p-10 md:p-12 rounded-3xl shadow-xl border border-slate-100 w-full max-w-md group hover:border-blue-100 transition-all duration-300">
            
            {/* Form Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-800 uppercase tracking-tight mb-3">
                Đăng Nhập
              </h2>
              <div className="w-16 h-1 bg-[#007db3] mx-auto rounded-full"></div>
            </div>
            
            <form onSubmit={handleLogin}>
              {/* Email Field */}
              <InputField
                label="Địa chỉ Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sv.vnu@hus.edu.vn"
                icon={(
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path>
                    </svg>
                )}
              />

              {/* Password Field */}
              <InputField
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                showPasswordToggle={true}
                isPasswordVisible={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                icon={(
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                )}
              />

              {/* Forgot Password */}
              <div className="flex justify-end mb-8 -mt-3">
                
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-full text-white font-bold bg-[#007db3] hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    Đăng Nhập Hệ Thống
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                    </svg>
                  </>
                )}
              </button>
            </form>
            
            {/* Footer Form */}
            <div className="mt-10 pt-6 border-t border-slate-100 text-center">
                <p className="text-slate-600 text-sm">
                    Chưa có tài khoản?{' '}
                    <Link to="/" className="font-semibold text-[#007db3] hover:underline">
                        Liên hệ Ban Quản lý
                    </Link>
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;