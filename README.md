# 🛒 Kiosk Status System - 0406 버전

Java + Spring Boot + React + Vite 기반의 **실시간 주문 상태 관리 키오스크 시스템**입니다.  
관리자는 주문 내역을 확인하고 상태를 변경하며, WebSocket 기반으로 실시간 알림까지 받아볼 수 있도록 구성되어 있습니다.

> ✨ 본 프로젝트는 과거 `kiosk-app`, `kiosk-frontend` 등 분리된 프로젝트를 통합하고, 여러 실험과 시행착오를 거쳐 구축된 **현장형 통합 프로젝트**입니다.

---

## 📦 프로젝트 구조

```
kiosk-system-vite/
│
├─ kiosk-app/                # 백엔드(Spring Boot, REST API, WebSocket)
├─ kiosk-frontend-vite/      # 프론트엔드(React + Vite)
└─ README.md                 # 이 문서
```

---

## 🚀 핵심 기능

### ✅ 사용자 기능
- 메뉴 목록 조회
- 장바구니 담기
- 주문 요청
- 카카오페이 결제 연동 (QR 생성 → 결제 승인)

### ✅ 관리자 기능
- 주문 목록 확인
- 주문 상세 보기
- 주문 상태 변경(PENDING → COMPLETED)
- WebSocket으로 실시간 새 주문 수신

---

## ⚙️ 기술 스택

| 분류 | 기술 |
|------|------|
| 프론트엔드 | React 19, Vite 6, Axios |
| 백엔드 | Java 17, Spring Boot 3, Spring Web, JPA |
| 인증 | Spring Security + JWT |
| 실시간 처리 | WebSocket (STOMP + SockJS) |
| DB | MySQL |
| 빌드도구 | Gradle |
| 스타일링 | ❗ **Tailwind CSS 적용 예정** |
| 효과음 | ❗ **띠링 알림음 적용 예정** |

---

## 📌 주문 상태 저장 기능

### 상태 값 종류 (`status` 필드)
- PENDING: 주문 접수 대기 중
- COMPLETED: 관리자에 의해 완료 처리됨

> 확장 예정: PREPARING, COOKED, CANCELLED 등 단계별 추가 가능

### 주문 상태 저장 흐름

1. 사용자가 주문 요청 (POST /api/orders) → 기본 상태: `PENDING`
2. 관리자가 상태 변경 버튼 클릭 → PATCH /api/admin/orders/{id}/status
3. 서버에서 상태 변경 처리 및 응답 반환
4. WebSocket을 통해 실시간 알림 전송 (/topic/orders)

---

## 🧠 과거 개발 히스토리 & 시행착오

### ❗ OrderStatus Enum 처리 실패 → 문자열 전환

#### 원래 설계
```java
public enum OrderStatus {
    PENDING, COMPLETED
}
```

- 프론트에서 `{ "status": "COMPLETED" }` 전송 시
- `@RequestBody OrderStatus status` 매핑에서 400 Bad Request 오류 발생

#### 시도한 해결책
- `@JsonCreator`, `@JsonValue` 적용 → 실패
- DTO로 감싸기 → 실패
- valueOf 수동 매핑 시도

#### 최종 해결
✅ **Enum 자체를 삭제하고 `String status`로 단순화**
```java
private String status;  // Enum 대신 문자열로 상태 처리
```

#### 이유와 교훈
- Enum은 직렬화 오류와 관리 이슈가 많았음
- 문자열 기반 구조가 프론트와 연동 및 확장성 측면에서 훨씬 유리함
- 유효값 검증은 수동으로 처리 가능하며 실무에 더 적합함

---

## ⚙️ 배포 히스토리

### ✅ 일반 `.jar` 파일 수동 배포
- `./gradlew bootJar`로 빌드하여 생성된 `kiosk-app-0.0.1-SNAPSHOT.jar` 파일을
- 실제 키오스크 장비에 수동 복사 후 실행
```bash
java -jar kiosk-app-0.0.1-SNAPSHOT.jar
```

- 정적 리소스 포함 (React build 결과물을 `/static`에 내장)

#### 문제점
- 파일 용량이 60MB 이상 → GitHub 업로드 시 경고 발생
- 키오스크 PC에서는 실행되나 자동 실행, 백그라운드 처리 미지원

---

### ❌ Docker 배포 실패 회고
- Dockerfile 구성 후 컨테이너 빌드 성공
```dockerfile
FROM openjdk:17
COPY build/libs/app.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

- `docker run -p 8081:8081` 으로 실행했으나
  - 외부 접속 불가 (localhost만 바인딩)
  - 환경 변수, 포트 설정 누락

#### 교훈
- Docker는 배포 자동화에 강력하지만 **환경 세팅이 까다로움**
- 초기에 `.jar` 수동 배포가 더 빠르고 안정적일 수 있음

---

## 🌐 포트 구성

| 서비스 | 포트 |
|--------|------|
| 프론트엔드 (Vite) | 5173 |
| 백엔드 (Spring Boot) | 8081 |

- `application.properties`에서 명시적으로 지정
```properties
server.port=8081
```
- 프론트에서는 Axios 또는 `.env` 파일로 API 서버 주소 지정

---

## 🧪 실행 방법

### 📌 백엔드 실행
```bash
cd kiosk-app
./gradlew bootRun
```

### 📌 프론트엔드 실행
```bash
cd kiosk-frontend-vite
npm install
npm run dev
```


# 🛠️ Kiosk Admin 프로젝트 (2025-04-13 업데이트)

## ✅ 오늘 진행한 작업 요약

### 1. 관리자 인증 시스템 (JWT) 점검 및 수정
- 기존 `token` 명칭을 그대로 유지하면서 JWT 인증 구조를 적용함.
- 로그인 시 `localStorage.setItem('token', ...)` 으로 저장되고,
- API 요청 시 `axiosInstance`를 통해 자동으로 `Authorization` 헤더 추가되도록 구성.

### 2. `RequireAuth.jsx` 인증 보호 라우터 수정
- 이전에는 `setValid(true)`로 인증을 무조건 통과시켰던 임시 코드였음.
- `jwt-decode`를 이용해 토큰 만료 여부를 확인하고 만료 시 로그인 페이지로 리디렉션되도록 개선.

```js
const token = localStorage.getItem('token');
const decoded = jwtDecode(token);
if (decoded.exp < 현재시간) {
  localStorage.removeItem('token');
  return <Navigate to="/admin/login" />;
}
```

### 3. axios 요청 오류 403 (Forbidden) 해결
- 요청 헤더에 토큰이 누락되어 서버에서 권한 거부 발생.
- `adminMenuApi.jsx`, `adminPaymentApi.jsx` 등에서 직접 헤더를 설정하거나,
  `axiosInstance.js`를 만들어 interceptor로 모든 요청에 자동으로 토큰을 붙이도록 구성함.
  
```js
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 4. 브라우저 콘솔 수동 토큰 입력 (임시 테스트)
```js
localStorage.setItem("token", "<JWT>");
```

---

## 💡 현재 상태

| 기능 | 작동 여부 |
|------|-----------|
| 로그인 → JWT 발급 | ✅ 정상 작동 |
| 관리자 페이지 접근 보호 | ✅ `RequireAuth` 통해 체크 |
| 메뉴 수정/삭제/등록 | ✅ 토큰이 있을 경우 정상 작동 |
| 토큰 만료 시 처리 | ✅ 로그인 페이지로 리디렉션 |

---

## 🔧 추가적으로 설치한 라이브러리

```bash
npm install jwt-decode
```

---

## 🔐 리프레시 토큰은 적용하지 않음
- 현재는 단순한 `accessToken` 방식만 사용 (10분 유효).
- 만료 시에는 로그인만 다시 하면 새 토큰 발급됨.

---

## 📁 폴더 구조 예시

```
kiosk-status-0406/
├── kiosk-app/              # Spring Boot 백엔드
├── kiosk-frontend-vite/    # React + Vite 프론트엔드
├── config-server/          # Spring Cloud Config
```

---

🕹️ 관리자는 `/admin/login`으로 로그인 후 `/admin/home` 으로 이동됩니다.

## ⚠️ 에러 상황 및 해결 요약

### 🔸 문제 1: 메뉴 수정/삭제 시 403 Forbidden 오류
- 원인: `Authorization` 헤더가 누락되거나 만료된 토큰을 사용함.
- 해결:
  - `axiosInstance.js`에 토큰 자동 부착 설정 추가.
  - `adminMenuApi.jsx`, `adminPaymentApi.jsx` 등에서 axios 대신 `axiosInstance`로 교체.

### 🔸 문제 2: RequireAuth 컴포넌트가 인증 검사를 하지 않음
- 원인: 초기 `setValid(true)`로 고정되어 항상 통과.
- 해결:
  - `jwt-decode`를 활용해 토큰의 `exp` 만료 여부를 검사하여 유효하지 않으면 로그인 페이지로 이동.

### 🔸 문제 3: 로그인 후에도 보호된 페이지 접근 불가
- 원인: 토큰은 저장되지만 요청 시 헤더에 포함되지 않아 백엔드에서 인증 실패.
- 해결:
  - 모든 axios 요청에 인터셉터로 토큰 삽입.
  - 필요한 API 파일에서 `axios` → `axiosInstance`로 수정.

---

## ✅ 적용된 주요 코드 요약

### ✅ 1. axiosInstance.js 설정

```js
// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export default axiosInstance;
```

### ✅ 2. adminMenuApi.jsx 예시

```js
// src/api/adminMenuApi.jsx
import axios from './axiosInstance';

export const getMenuById = async (id) => {
  const response = await axios.get(`/api/admin/menus/${id}`);
  return response.data;
};
```

### ✅ 3. RequireAuth.jsx 수정

```js
// src/components/RequireAuth.jsx
import { jwtDecode } from 'jwt-decode';
import { Navigate } from 'react-router-dom';

function RequireAuth({ children }) {
  const token = localStorage.getItem('token');

  if (!token) return <Navigate to="/admin/login" replace />;

  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      localStorage.removeItem('token');
      return <Navigate to="/admin/login" replace />;
    }
  } catch (e) {
    localStorage.removeItem('token');
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
```

이제 관리자 메뉴 관련 요청들은 인증이 자동으로 적용되며, 토큰이 만료되었을 경우 로그인 페이지로 이동하도록 구성됨.


# 🛠️ Kiosk 프로젝트 PM2 풀스택 배포 가이드 (2025-04-13 기준)

## ✅ 설치 전 필수 조건

### 🔧 필요 설치 항목
- Node.js (v18 이상 권장)
- Java 17
- MySQL 8.x
- Git (선택)

---

## ✅ 프로젝트 클론
```bash
cd D:\kiosk-system
git clone https://github.com/Youngjoon-Park/kiosk-admin0413.git
```

---

## ✅ 디렉토리 구조
```
kiosk-admin0413/
├── kiosk-app/                # 백엔드 Spring Boot (.jar)
├── kiosk-frontend-vite/      # 프론트 React (Vite 기반)
├── config-server/            # Spring Cloud Config 서버
```

---

## ✅ MySQL 설정

```sql
CREATE DATABASE kioskdb DEFAULT CHARACTER SET utf8mb4;
CREATE USER 'kiosk_user'@'%' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON kioskdb.* TO 'kiosk_user'@'%';
FLUSH PRIVILEGES;
```

---

## ✅ 백엔드 실행 순서

### 1. Config 서버 실행 (먼저!)
```bash
cd kiosk-admin0413/config-server
./gradlew bootRun
```

### 2. 메인 백엔드 앱 실행
```bash
cd kiosk-admin0413/kiosk-app
./gradlew bootRun
```

서버는 `localhost:8081` 에서 작동

---

## ✅ 프론트 빌드 및 PM2 배포

### 1. 의존성 설치
```bash
cd kiosk-admin0413/kiosk-frontend-vite
npm install
```

### 2. 빌드 (Vite)
```bash
npm run build
```

### 3. PM2로 정적 서버 실행 (serve 설치 필요)
```bash
npm install -g serve pm2
```

### 4. ecosystem.config.cjs 생성 (vite 전용)
```js
module.exports = {
  apps: [
    {
      name: 'kiosk-frontend',
      script: 'node_modules/serve/bin/serve.js',
      args: '-s dist -l 4173',
      cwd: './',
    },
  ],
};
```

### 5. PM2 실행
```bash
pm2 start ecosystem.config.cjs
```

→ 정상 작동 시 `localhost:4173` 접속 가능

---

## ✅ 에러 해결 팁

### ❌ `Access to XMLHttpRequest` (CORS 오류)
- 백엔드 `SecurityConfig.java`에 CORS 허용 설정 필요
```java
config.addAllowedOrigin("http://localhost:4173");
```

### ❌ `Script not found: npm run preview`
- preview는 개발용, PM2에서는 `serve`로 실행해야 함

### ❌ ecosystem.config.js 오류
- Vite 프로젝트는 `.cjs` 확장자 사용 (`module.exports` 방식)

---

## ✅ PM2 유용 명령어
```bash
pm2 list                  # 전체 앱 상태 확인
pm2 logs kiosk-frontend   # 로그 보기
pm2 stop kiosk-frontend   # 중지
pm2 restart kiosk-frontend # 재시작
pm2 delete kiosk-frontend # 제거
pm2 save && pm2 startup   # 부팅 시 자동 실행 등록
```

---

## ✅ 요약
| 항목 | 내용 |
|------|------|
| 프론트 포트 | `4173` |
| 백엔드 포트 | `8081` |
| MySQL 포트 | `3306` |
| JWT 인증 | `/admin/login`에서 발급됨 (토큰 10분 유효) |
| 토큰 위치 | `localStorage.setItem('token', ...)` |

---

## 📦 배포 흐름 요약
```
1. config-server 실행
2. kiosk-app 실행
3. kiosk-frontend-vite 빌드
4. PM2 serve 실행 (4173)
5. http://localhost:4173 접속
```


