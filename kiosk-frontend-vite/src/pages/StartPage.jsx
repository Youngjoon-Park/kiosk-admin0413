// src/pages/StartPage.jsx
import { useNavigate } from 'react-router-dom';

export default function StartPage() {
  const navigate = useNavigate();

  const handleClick = (isTakeOut) => {
    // 🔧 [추가] 선택값을 세션스토리지에 저장
    sessionStorage.setItem('isTakeOut', isTakeOut);

    // 기존처럼 상태도 함께 넘김 (선택사항)
    navigate('/main', { state: { isTakeOut } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f8ff]">
      {/* 상단 안내 */}
      <p className="text-gray-600 text-xl mb-2 tracking-wide">기다리지 말고</p>

      {/* 메인 문구 */}
      <h1 className="text-4xl md:text-5xl font-bold mb-12">
        <span className="text-red-600">간편</span>
        하게 주문하세요
      </h1>

      {/* 버튼 영역 */}
      <div className="flex gap-6 w-full max-w-md px-4">
        <button
          onClick={() => handleClick(false)}
          className="flex-1 bg-white border border-orange-400 text-orange-500 text-lg font-semibold py-6 rounded-lg shadow-md hover:bg-orange-50"
        >
          🍽 매장
          <br />
          <span className="text-sm text-gray-500">For Here</span>
        </button>
        <button
          onClick={() => handleClick(true)}
          className="flex-1 bg-white border border-red-400 text-red-500 text-lg font-semibold py-6 rounded-lg shadow-md hover:bg-red-50"
        >
          🛍 포장
          <br />
          <span className="text-sm text-gray-500">Take-out</span>
        </button>
      </div>
    </div>
  );
}
