import axiosClient from './axiosClient';

export const adminApi = {
  createUser: (userData) => {
    return axiosClient.post('/admin/users', userData);
  },
  getUsers: () => {
    return axiosClient.get('/admin/users');
  },
  updateUser: (id, userData) => {
    return axiosClient.put(`/admin/users/${id}`, userData);
  },
  deleteUser: (id) => {
    return axiosClient.delete(`/admin/users/${id}`);
  }
};