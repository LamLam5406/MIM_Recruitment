import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho Request: Tự động đính kèm Token trước khi gửi lên Server
axiosClient.interceptors.request.use(
  (config) => {
    // ĐỔI THÀNH sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho Response: Xử lý dữ liệu trả về và bắt lỗi chung
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về thẳng data để code gọn hơn (không cần res.data.data)
    return response.data;
  },
  (error) => {
    // Nếu lỗi 401 (Unauthorized) do token hết hạn hoặc không hợp lệ
    if (error.response && error.response.status === 401) {
      // ĐỔI THÀNH sessionStorage
      sessionStorage.removeItem('token');
      // Redirect về trang login (tùy thuộc vào cách bạn setup Router sau này)
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;