import axiosClient from './axiosClient';

export const newsApi = {
  getAllNews: (page = 1, limit = 10) => {
    return axiosClient.get(`/news?page=${page}&limit=${limit}`);
  },
  getNewsById: (id) => {
    return axiosClient.get(`/news/${id}`);
  },
  // Các API dưới đây cần Token Admin (đã được axiosClient tự động đính kèm)
  createNews: (formData) => {
    return axiosClient.post('/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  updateNews: (id, formData) => {
    return axiosClient.put(`/news/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteNews: (id) => {
    return axiosClient.delete(`/news/${id}`);
  }
};