// src/api/interview.api.js
import axiosClient from './axiosClient';

export const interviewApi = {
  sendInvites: async (emails, subject, content) => {
    try {
      const response = await axiosClient.post('/interviews/send-invites', {
        emails,
        subject,
        content
      });

      // SỬA Ở ĐÂY: Trả về trực tiếp response vì axiosClient đã bóc data sẵn rồi
      return response; 

    } catch (error) {
      // Sửa lại cách lấy message lỗi cho an toàn
      throw new Error(
        error.response?.data?.message || error.message || 'Có lỗi xảy ra khi gửi thông báo'
      );
    }
  },
};