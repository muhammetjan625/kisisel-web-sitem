import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* Firebase için basename ayarını '/' yaptık veya tamamen sildik */}
      <BrowserRouter basename="/">
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);