// src/components/Cart.js
import React from 'react';
import axios from 'axios';
import './Cart.css';

function Cart({ cartItems, clearCart, updateQuantity, isTakeOut }) {
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어 있습니다.');
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
      })),
      takeOut: isTakeOut, // ✅ 여기 추가
    };

    axios
      .post('http://localhost:8081/order', orderData)
      .then((res) => {
        const orderId = res.data?.orderId;
        if (!orderId) {
          console.error('❌ orderId가 없습니다. 결제 중단');
          alert('결제 정보를 불러올 수 없습니다.');
          return;
        }

        window.location.href = `http://localhost:5173/payment/${orderId}`;
        clearCart();
      })
      .catch((err) => {
        console.error('❌ 주문 실패:', err);
        alert('주문 등록 실패');
      });
  };

  return (
    <div className="cart-container">
      <h2>🛒 장바구니</h2>
      {cartItems.length === 0 ? (
        <p>장바구니가 비어 있습니다.</p>
      ) : (
        <>
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                {item.name} / 수량: {item.quantity} / 합계:{' '}
                {item.price * item.quantity}원
                <button
                  onClick={() => updateQuantity(item.id, 1)}
                  className="quantity-btn"
                >
                  ➕
                </button>
                <button
                  onClick={() => updateQuantity(item.id, -1)}
                  className="quantity-btn"
                >
                  ➖
                </button>
              </li>
            ))}
          </ul>
          <h3>총 금액: {totalPrice.toLocaleString()}원</h3>
          <button onClick={handleCheckout} className="checkout-btn">
            💳 결제하기
          </button>
          <button onClick={clearCart} className="clear-btn">
            ❌ 비우기
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
