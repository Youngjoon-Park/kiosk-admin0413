import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/admin/login" replace />;

  try {
    const decoded = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp && decoded.exp < currentTime) {
      // ⏰ 만료됨
      alert('토큰이 만료되었습니다. 다시 로그인 해주세요.');
      localStorage.removeItem('token');
      return <Navigate to="/admin/login" replace />;
    }
  } catch (err) {
    console.error('❌ 토큰 디코딩 실패:', err);
    localStorage.removeItem('token');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default RequireAuth;
