import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // ✅ 토큰 삭제
    alert('로그아웃 되었습니다.');
    navigate('/admin/login'); // 로그인 페이지로 이동
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>
        👨‍💼 관리자 페이지
      </h2>

      <button
        onClick={handleLogout}
        style={{ ...linkStyle, backgroundColor: '#f44336' }}
      >
        🔓 로그아웃
      </button>

      <ul
        style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          marginTop: '20px',
        }}
      >
        <li>
          <Link to="/admin/orders" style={linkStyle}>
            📦 주문 내역 보기
          </Link>
        </li>
        <li>
          <Link to="/admin/payments" style={linkStyle}>
            💳 결제 내역 보기
          </Link>
        </li>
        <li>
          <Link to="/menu-test" style={linkStyle}>
            🍽️ 메뉴 목록 보기
          </Link>
        </li>
        <li>
          <Link to="/menu-add" style={linkStyle}>
            ➕ 메뉴 추가
          </Link>
        </li>
      </ul>
    </div>
  );
};

const linkStyle = {
  display: 'block',
  padding: '12px 20px',
  backgroundColor: '#4caf50',
  color: 'white',
  textDecoration: 'none',
  borderRadius: '8px',
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
};

export default AdminHome;
