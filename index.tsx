import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// 1. 必须引入 BrowserRouter，如果没有这一行会报错
import { BrowserRouter } from 'react-router-dom'; 

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    {/* 2. 在这里包裹 App，并加上 basename */}
    <BrowserRouter basename="/chongwuyangcheng">
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
