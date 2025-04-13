import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // `orderId`가 없으면 sessionStorage에서 가져오기
  const validOrderId = orderId || sessionStorage.getItem('orderId');

  useEffect(() => {
    if (!validOrderId) {
      console.error('❌ orderId가 없습니다.');
      alert('잘못된 주문입니다.');
      return;
    }

    console.log('📍 PaymentPage 진입');
    console.log('📍 받은 orderId:', validOrderId);
    console.log('결제 준비 중... OrderId:', validOrderId);

    axios
      .post(`http://localhost:8081/payment/${validOrderId}`)
      .then((response) => {
        const redirectUrl = response.data.redirectUrl;
        console.log('✅ 결제 준비 완료: ', redirectUrl);

        // 결제 페이지로 리디렉션
        window.location.href = redirectUrl;
      })
      .catch((error) => {
        console.error('❌ 결제 준비 실패:', error);
        alert('결제 준비에 실패했습니다.');
      });
  }, [validOrderId]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>🔄 결제 페이지를 여는 중입니다...</h2>
      <p>잠시만 기다려 주세요.</p>
    </div>
  );
}

export default PaymentPage;
