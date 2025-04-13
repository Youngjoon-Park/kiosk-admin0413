// 📁 src/pages/AdminPaymentPage.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const AdminPaymentPage = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('http://localhost:8081/api/admin/payments');
        setPayments(res.data);
      } catch (err) {
        console.error('❌ 결제 내역 불러오기 실패:', err);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>💳 결제 내역</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f1f1f1' }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>주문번호</th>
            <th style={thStyle}>TID</th>
            <th style={thStyle}>상태</th>
            <th style={thStyle}>승인시간</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td style={tdStyle}>{p.id}</td>
              <td style={tdStyle}>{p.orderId}</td>
              <td style={tdStyle}>{p.tid}</td>
              <td style={tdStyle}>{p.status}</td>
              <td style={tdStyle}>
                {p.approvedAt
                  ? p.approvedAt.replace('T', ' ').slice(0, 19)
                  : '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'center',
  backgroundColor: '#eee',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'center',
};

export default AdminPaymentPage;
