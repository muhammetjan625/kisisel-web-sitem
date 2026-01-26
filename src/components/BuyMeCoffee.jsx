import React from 'react';
import { FaCoffee, FaHeart } from 'react-icons/fa';
import './BuyMeCoffee.css';

const BuyMeCoffee = () => {
  return (
    <a 
      href="https://buymeacoffee.com/momocuk" // BURAYA KENDİ LİNKİNİ YAPIŞTIR
      target="_blank" 
      rel="noopener noreferrer" 
      className="coffee-widget"
    >
      <div className="coffee-icon-wrapper">
        <FaCoffee className="coffee-icon" />
        <div className="steam-animation">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="coffee-text">
        <span>Kodlar çalışıyorsa</span>
        <strong>Bir Kahve Ismarla?</strong>
      </div>
      <div className="coffee-glow"></div>
    </a>
  );
};

export default BuyMeCoffee;