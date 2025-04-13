// src/pages/OrderMenuPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderMenuPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isTakeOut = location.state?.isTakeOut;

  const [menus, setMenus] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    console.log('🔥 [OrderMenuPage] isTakeOut:', isTakeOut);

    if (location.state === null || isTakeOut === undefined) {
      alert('포장/매장 선택 후 접근해주세요.');
      navigate('/');
    }
  }, [location.state, isTakeOut, navigate]);

  useEffect(() => {
    axios
      .get('http://localhost:8081/api/menus') // ✅ 수정된 경로
      .then((res) => {
        console.log('📦 서버 응답:', res.data);
        setMenus(res.data); // 또는 setMenus(res.data.menus) 구조 확인 후 조정
      })
      .catch((err) => {
        alert('메뉴를 불러오지 못했습니다.');
        console.error(err);
      });
  }, []);

  const addToCart = (menu) => {
    setCartItems((prev) => [...prev, menu]);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>{isTakeOut ? '🛍 포장 주문입니다' : '🍽 매장 주문입니다'}</h2>

      <h3>메뉴 선택</h3>
      <ul>
        {(Array.isArray(menus) ? menus : []).map((menu) => (
          <li key={menu.id}>
            {menu.name} - {menu.price}원
            <button
              onClick={() => addToCart(menu)}
              style={{ marginLeft: '10px' }}
            >
              담기
            </button>
          </li>
        ))}
      </ul>

      <h3>장바구니</h3>
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

export default OrderMenuPage;
