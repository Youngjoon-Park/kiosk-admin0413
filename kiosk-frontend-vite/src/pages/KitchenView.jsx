// src/pages/KitchenView.jsx
import React, { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const KitchenView = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8081/ws-endpoint'), // ✅ 포트 수정 (8080 → 8081)
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ 웹소켓 연결 성공');
        client.subscribe('/topic/new-orders', (message) => {
          console.log('💬 받은 메시지:', message.body); // 메시지 확인용 로그

          const order = JSON.parse(message.body);
          console.log('📦 받은 order.takeOut:', order.takeOut); // ✅ 제대로 된 takeOut 확인

          setOrders((prev) => [order, ...prev]);
        });
      },
      onStompError: (frame) => {
        console.error('🚨 STOMP 에러:', frame);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">🧑‍🍳 주방 주문 목록</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index} className="border-b py-2">
            <strong>주문번호:</strong> {order.id} <br />
            <strong>주문형태:</strong>{' '}
            {order.takeOut === true
              ? '🛍 포장'
              : order.takeOut === false
              ? '🍽 매장'
              : '❓ 알 수 없음'}
            <br />
            <strong>주문메뉴:</strong>{' '}
            {order.items
              .map((item) => `${item.name} (${item.quantity}개)`)
              .join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default KitchenView;
