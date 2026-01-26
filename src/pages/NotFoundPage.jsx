import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-wrapper fade-in-bottom">
      <div className="glitch-container">
        <h1 className="glitch-404" data-text="404">404</h1>
      </div>
      
      <div className="not-found-content">
        <FaExclamationTriangle className="warning-icon" />
        <h2>Hata: Sayfa Bulunamadı</h2>
        <p>
          Aradığın sayfa siber uzayda kaybolmuş gibi görünüyor.<br />
          Ya link yanlış ya da bu sayfa artık yok.
        </p>
        
        <Link to="/" className="home-btn">
          <FaHome /> Ana Sayfaya Işınlan
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;