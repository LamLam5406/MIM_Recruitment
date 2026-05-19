import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // Chờ kiểm tra token trong local storage xong mới render
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Chưa đăng nhập -> đá về trang Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Đã đăng nhập nhưng sai Role -> đá về trang báo lỗi hoặc trang chủ của họ
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Hợp lệ -> Cho phép render các component con bên trong
  return <Outlet />;
};

export default ProtectedRoute;