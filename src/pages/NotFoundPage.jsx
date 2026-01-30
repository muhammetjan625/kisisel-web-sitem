import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <SEO title="404 - Sayfa Bulunamadı" description="Aradığınız sayfa siber uzayda kayboldu." />
      
      <div className="glitch-wrapper">
        <h1 className="glitch" data-text="404">404</h1>
      </div>
      
      <div className="error-content">
        <h2>SİSTEM HATASI: SAYFA BULUNAMADI</h2>
        <p>Aradığınız veri bloğu siber uzayda kaybolmuş veya silinmiş görünüyor. Bağlantı koptu.</p>
        
        <Link to="/" className="home-btn">
          <FaHome /> GÜVENLİ BÖLGEYE DÖN
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;