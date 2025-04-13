// 📁 src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import MainRouter from './MainRouter';
import './index.css'; // Tailwind CSS 적용

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<MainRouter />);
