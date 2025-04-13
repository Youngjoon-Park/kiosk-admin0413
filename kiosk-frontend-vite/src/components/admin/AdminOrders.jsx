// src/components/admin/AdminOrders.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);

  const getStatus = (status) => {
    try {
      if (typeof status === 'object') return status.status;
      if (typeof status === 'string' && status.includes('{'))
        return JSON.parse(status).status;
      return status;
    } catch {
      return status;
    }
  };

  useEffect(() => {
    axios
      .get('http://localhost:8081/api/admin/orders')
      .then((res) => setOrders(res.data.sort((a, b) => b.id - a.id)))
      .catch((err) => console.error('❌ 주문 목록 불러오기 실패:', err));

    const socket = new SockJS('http://localhost:8081/ws-endpoint');
    const client = Stomp.over(socket);
    client.debug = false;

    client.connect({}, () => {
      client.subscribe('/topic/orders', (message) => {
        const newOrder = JSON.parse(message.body);
        setOrders((prev) => [newOrder, ...prev].sort((a, b) => b.id - a.id));
        setCurrentOrder(newOrder);
      });
    });

    return () => client.disconnect();
  }, []);

  const fetchOrderDetail = (id) => {
    axios
      .get(`http://localhost:8081/api/admin/orders/${id}`)
      .then((res) => setCurrentOrder(res.data));
  };

  const changeStatus = (id) => {
    axios
      .patch(`http://localhost:8081/api/admin/orders/${id}/status`, {
        status: 'COMPLETED',
      })
      .then(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === id ? { ...order, status: 'COMPLETED' } : order
          )
        );
        setCurrentOrder(null);
      });
  };

  const status = getStatus(currentOrder?.status);

  return (
    <div className="p-4">
      {currentOrder && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-white shadow-lg border p-5 rounded-xl z-50">
          <h2 className="text-xl font-bold mb-2">
            주문 상세 (ID: {currentOrder.id})
          </h2>
          <p>총 가격: {currentOrder.totalPrice} 원</p>
          <p>상태: {status}</p>
          <div className="mt-2">
            <strong>주문 항목</strong>
            {currentOrder.items?.map((item, idx) => (
              <div key={idx}>
                메뉴: {item.menuName}, 수량: {item.quantity}, 가격: {item.price}{' '}
                원
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {status !== 'COMPLETED' && (
              <button
                onClick={() => changeStatus(currentOrder.id)}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                완료로 변경
              </button>
            )}
            <button
              onClick={() => setCurrentOrder(null)}
              className="bg-gray-600 text-white px-4 py-1 rounded"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mt-16 mb-4">주문 관리</h1>

      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">주문번호</th>
            <th className="border p-2">메뉴</th>
            <th className="border p-2">수량</th>
            <th className="border p-2">상태</th>
            <th className="border p-2">상세보기</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const status = getStatus(order.status);
            return (
              <tr key={order.id}>
                <td className="border p-2">{order.id}</td>
                <td className="border p-2">
                  {order.items?.map((item, i) => (
                    <div key={i}>{item.menuName}</div>
                  ))}
                </td>
                <td className="border p-2">
                  {order.items?.map((item, i) => (
                    <div key={i}>{item.quantity}</div>
                  ))}
                </td>
                <td className="border p-2">{status}</td>
                <td className="border p-2">
                  <button
                    onClick={() => fetchOrderDetail(order.id)}
                    className="text-blue-600 underline"
                  >
                    상세보기
                  </button>
                  {status !== 'COMPLETED' && (
                    <button
                      onClick={() => changeStatus(order.id)}
                      className="text-green-600 underline ml-2"
                    >
                      완료로 변경
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
