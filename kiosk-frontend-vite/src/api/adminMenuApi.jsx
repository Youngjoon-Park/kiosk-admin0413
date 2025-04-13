// 📁 src/api/adminMenuApi.jsx
import axios from './axiosInstance'; // ✅ 경로 수정하여 axiosInstance 사용

// ✅ 사용자용 공개 API
export const getAllMenus = async () => {
  const response = await axios.get('http://localhost:8081/api/menus');
  return response.data;
};

// ✅ 관리자용 메뉴 추가
export const addMenu = async (menu) => {
  const response = await axios.post(
    'http://localhost:8081/api/admin/menus',
    menu
  );
  return response.data;
};

// ✅ 관리자용 메뉴 삭제
export const deleteMenu = async (id) => {
  await axios.delete(`http://localhost:8081/api/admin/menus/${id}`);
};

// ✅ 관리자용 메뉴 조회 (ID로)
export const getMenuById = async (id) => {
  const response = await axios.get(
    `http://localhost:8081/api/admin/menus/${id}`
  );
  return response.data;
};

// ✅ 관리자용 메뉴 수정
export const updateMenu = async (id, menu) => {
  await axios.put(`http://localhost:8081/api/admin/menus/${id}`, menu);
};
