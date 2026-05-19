import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

// Khởi tạo Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra token mỗi khi load lại trang
  useEffect(() => {
    const checkAuth = () => {
      // ĐỔI THÀNH sessionStorage
      const token = sessionStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          // Kiểm tra xem token đã hết hạn chưa (dựa trên cấu hình { expiresIn: '1h' } ở backend)
          if (decoded.exp < currentTime) {
            logout();
          } else {
            // Lưu thông tin giải mã (id, role) vào state
            setUser({ id: decoded.id, role: decoded.role, email: decoded.email });
          }
        } catch (error) {
          console.error('Lỗi giải mã token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = (token, userData) => {
    // ĐỔI THÀNH sessionStorage
    sessionStorage.setItem('token', token);
    setUser(userData); // userData là object chứa { id, role }
  };

  const logout = () => {
    // ĐỔI THÀNH sessionStorage
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};