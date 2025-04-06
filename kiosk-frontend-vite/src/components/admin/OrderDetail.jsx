// src/components/admin/OrderDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function OrderDetail({ orderId: propId, onClose }) {
  const { orderId: paramId } = useParams(); // 라우터에서 접근할 경우
  const orderId = propId || paramId;

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null); // 오류 상태 추가
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    if (!orderId) return;
    console.log('📦 요청할 주문 ID:', orderId);

    const fetchOrderDetail = async () => {
      setLoading(true); // 로딩 시작
      try {
        const response = await axios.get(
          `http://localhost:8081/api/admin/orders/${orderId}`
        );
        setOrder(response.data);
        setError(null); // 오류 초기화
      } catch (error) {
        console.error('❌ 상세 정보 가져오기 실패:', error);
        setError('주문 상세 정보를 가져오는 데 실패했습니다.');
      } finally {
        setLoading(false); // 로딩 끝
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  const handleCompleteStatus = async () => {
    try {
      const response = await axios.patch(
        `http://localhost:8081/api/admin/orders/${orderId}/status`,
        { status: 'COMPLETED' } // 상태를 COMPLETED로 변경
      );
      setOrder(response.data); // 변경된 상태로 UI 갱신
    } catch (error) {
      console.error('❌ 상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  if (loading) return <div>📦 로딩 중...</div>;
  if (error) return <div className="text-red-500">{error}</div>; // 오류 메시지 출력

  if (!order) return <div>📦 주문 정보가 없습니다.</div>;

  return (
    <div className="p-4 border mt-4 bg-gray-100 rounded">
      {/* <h2 className="text-xl font-bold mb-2">주문 상세 (ID: {order.orderId})</h2> */}
      <h2 className="text-xl font-bold mb-2">주문 상세 (ID: {orderId})</h2>
      <p>
        <strong>총 가격:</strong> {order.totalPrice} 원
      </p>
      <p>
        <strong>상태:</strong> {order.status}
      </p>
      <h3 className="mt-2 font-semibold">주문 항목</h3>
      <ul className="list-disc pl-6">
        {order.items.map((item, index) => (
          <li key={index}>
            메뉴: {item.menuName}, 수량: {item.quantity}, 가격: {item.price} 원
          </li>
        ))}
      </ul>

      {/* 상태가 PENDING일 경우만 버튼 활성화 */}
      {order.status === 'PENDING' && (
        <button
          onClick={handleCompleteStatus}
          className="mt-4 bg-green-500 text-white px-4 py-1 rounded"
        >
          완료로 변경
        </button>
      )}

      {onClose && (
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white px-4 py-1 rounded"
        >
          닫기
        </button>
      )}
    </div>
  );
}

export default OrderDetail;
