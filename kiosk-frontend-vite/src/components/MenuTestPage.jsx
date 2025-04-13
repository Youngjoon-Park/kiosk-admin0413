import React, { useState, useEffect } from 'react';
import axios from 'axios'; // ✅ axios 임포트 추가

const MenuTestPage = () => {
  const [menus, setMenus] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  // ✅ 실제 메뉴 불러오는 함수
  const fetchMenus = () => {
    axios
      .get('http://localhost:8081/menu/menus')
      .then((res) => setMenus(res.data))
      .catch((err) => {
        console.error('메뉴 불러오기 실패:', err);
        alert('메뉴를 불러오지 못했습니다.');
      });
  };

  useEffect(() => {
    fetchMenus(); // ✅ 최초 로딩 시 메뉴 불러오기
  }, []);

  const addToCart = (menu) => {
    setCartItems((prev) => [...prev, menu]);
  };

  const deleteMenu = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axios
        .delete(`http://localhost:8081/menu/menus/${id}`)
        .then(() => {
          alert('삭제되었습니다.');
          fetchMenus(); // ✅ 삭제 후 다시 불러오기
        })
        .catch((err) => {
          console.error('삭제 실패:', err);
          alert('삭제에 실패했습니다.');
        });
    }
  };

  return (
    <div>
      <h1>메뉴</h1>
      <ul>
        {menus.map((menu) => (
          <li key={menu.id}>
            {menu.name} - {menu.price}원
            <button onClick={() => addToCart(menu)}>담기</button>
            <button onClick={() => deleteMenu(menu.id)}>삭제</button>
          </li>
        ))}
      </ul>

      <h2>장바구니</h2>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index}>
            {item.name} - {item.price}원
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuTestPage;
