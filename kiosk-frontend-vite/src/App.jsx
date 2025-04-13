import React from 'react';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import TestOrderButton from './components/TestOrderButton'; // ✅ 테스트 버튼 임포트
import { useLocation } from 'react-router-dom';

function App({ cartItems, addToCart, updateQuantity, clearCart }) {
  const location = useLocation();

  const isTakeOut =
    location.state?.isTakeOut ??
    (sessionStorage.getItem('isTakeOut') === 'true' ? true : false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 p-8 max-w-6xl mx-auto overflow-x-hidden">
      {/* 주문 형태 안내 */}
      <h2 className="text-center mb-4 text-xl font-medium">
        {isTakeOut === true && '🛍 포장 주문입니다'}
        {isTakeOut === false && '🍽 매장 주문입니다'}
        {isTakeOut === undefined && '❓ 주문 형태를 알 수 없습니다'}
      </h2>

      <h1 className="text-center text-4xl font-bold mb-8">키오스크 메인</h1>

      {/* ✅ 테스트용 버튼 삽입 */}
      <div className="mb-6">
        <TestOrderButton />
      </div>

      <MenuList addToCart={addToCart} />

      <Cart
        cartItems={cartItems}
        clearCart={clearCart}
        updateQuantity={updateQuantity}
        isTakeOut={isTakeOut}
      />
    </div>
  );
}

export default App;
