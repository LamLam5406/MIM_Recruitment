import axiosClient from './axiosClient';

export const authApi = {
  // 1. Đăng nhập
  login: (email, password) => {
    return axiosClient.post('/auth/login', { email, password });
  },

  // 2. Lấy thông tin User hiện tại (kèm Profile)
  getProfile: () => {
    return axiosClient.get('/auth/profile');
  },

  // 3. Cập nhật Profile (Hỗ trợ upload file CV/Logo)
  updateProfile: (formData) => {
    return axiosClient.put('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};