import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function PaymentSuccessPage({ clearCart }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pgToken = searchParams.get('pg_token');
  // orderId가 없으면 sessionStorage에서 가져오기
  const orderId =
    searchParams.get('orderId') || sessionStorage.getItem('orderId');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [approved, setApproved] = useState(false); // 중복 방지

  useEffect(() => {
    if (!pgToken || !orderId || approved) return;

    const approve = async () => {
      try {
        console.log('pgToken:', pgToken);
        console.log('orderId:', orderId);

        const res = await axios.post('http://localhost:8081/payment/approve', {
          pgToken,
          orderId,
        });

        console.log('✅ 승인 성공 응답:', res.data);
        setApproved(true);
        alert('🎉 결제 승인 완료!');
        setPaymentStatus('SUCCESS');
        if (clearCart) clearCart();

        sessionStorage.removeItem('orderId'); // 결제 후 `orderId` 제거

        setTimeout(() => navigate('/'), 1000);
      } catch (error) {
        console.error('❌ 승인 실패:', error);
        alert('❌ 결제 승인 실패!');
        setPaymentStatus('FAILED');
      }
    };

    approve();
  }, [pgToken, orderId, clearCart, navigate, approved]);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      {paymentStatus === 'SUCCESS' ? (
        <h2>🎉 결제가 성공적으로 승인되었습니다!</h2>
      ) : paymentStatus === 'FAILED' ? (
        <h2>❌ 결제 승인에 실패했습니다.</h2>
      ) : (
        <h2>⏳ 결제 승인 중입니다...</h2>
      )}
    </div>
  );
}

export default PaymentSuccessPage;
