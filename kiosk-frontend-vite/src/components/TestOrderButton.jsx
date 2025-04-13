// src/components/TestOrderButton.jsx
import axios from 'axios';

const TestOrderButton = () => {
  const sendOrder = async (takeOutValue) => {
    try {
      await axios.post('http://localhost:8081/order', {
        items: [
          { menuId: 1, quantity: 1 }, // 아메리카노
          { menuId: 5, quantity: 2 }, // 바닐라라떼
        ],
        takeOut: takeOutValue,
      });
      alert(takeOutValue ? '🛍 포장 주문 전송!' : '🍽 매장 주문 전송!');
    } catch (err) {
      console.error('❌ 주문 실패:', err);
      alert('주문 실패 😢');
    }
  };

  return (
    <div className="p-4 space-x-2">
      <button
        onClick={() => sendOrder(true)}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        포장 주문 보내기
      </button>
      <button
        onClick={() => sendOrder(false)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        매장 주문 보내기
      </button>
    </div>
  );
};

export default TestOrderButton;
