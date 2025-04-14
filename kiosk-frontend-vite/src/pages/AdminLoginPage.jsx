// 📁 src/pages/AdminLoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ 폼 제출 시 새로고침 방지

    try {
      const response = await axios.post('/api/admin/login', {
        username,
        password,
      });

      localStorage.setItem('token', response.data); // JWT 저장
      alert('로그인 성공!');
      navigate('/admin/home'); // 관리자 홈으로 이동
    } catch (error) {
      alert('로그인 실패. 아이디 또는 비밀번호를 확인하세요.');
    }
  };

  return (
    <div style={styles.container}>
      <h2>관리자 로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          style={styles.input}
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={styles.button}>
          로그인
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '300px',
    margin: '100px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: '10px',
    padding: '8px',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default AdminLoginPage;
