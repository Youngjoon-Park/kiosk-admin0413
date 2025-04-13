// src/pages/CartPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = ({ cartItems, updateQuantity, clearCart, isTakeOut }) => {
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = async () => {
    try {
      const res = await axios.post('http://localhost:8081/order', {
        items: cartItems.map((item) => ({
          menuId: item.id,
          quantity: item.quantity,
        })),
        takeOut: isTakeOut, // ✅ 포장 여부 전달
      });

      console.log('🟡 전체 응답:', res.data);
      const orderId = res.data?.orderId;
      console.log('✅ 생성된 orderId:', orderId);

      if (!orderId) {
        alert('주문 ID를 받아오지 못했습니다.');
        return;
      }

      navigate(`/payment/${orderId}`);
    } catch (error) {
      console.error('❌ 주문 생성 또는 이동 실패', error);
      alert('결제를 시작할 수 없습니다.');
    }
  };

  return (
    <div>
      <h2>🛒 장바구니</h2>
      {cartItems.length === 0 ? (
        <p>장바구니가 비어있습니다.</p>
      ) : (
        <>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                {item.name} - {item.price}원 × {item.quantity}
                <button onClick={() => updateQuantity(item.id, -1)}>-</button>
                <button onClick={() => updateQuantity(item.id, 1)}>+</button>
              </li>
            ))}
          </ul>
          <h3>총합: {total.toLocaleString()}원</h3>
          <button onClick={handleCheckout}>💳 결제하기</button>
          <button onClick={clearCart}>❌ 장바구니 비우기</button>
        </>
      )}
      <button onClick={() => navigate('/')}>← 메뉴로 돌아가기</button>
    </div>
  );
};

export default CartPage;
