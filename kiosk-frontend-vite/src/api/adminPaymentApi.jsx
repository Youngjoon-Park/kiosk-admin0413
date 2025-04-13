// 📁 src/api/adminPaymentApi.jsx
import axios from './axiosInstance';

export const getAllPayments = async () => {
  const token = localStorage.getItem('token'); // 로컬스토리지에서 토큰을 가져옵니다.
  const response = await axios.get('http://localhost:8081/api/admin/payments', {
    headers: {
      Authorization: `Bearer ${token}`, // 헤더에 토큰을 넣어 보냅니다.
    },
  });
  return response.data;
};
