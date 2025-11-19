import React from 'react';
import './Loading.css';

const Loading = () => {
  return (
    <div className="loading-wrapper">
      <div className="loading-content">
        {/* Dönen Neon Halka */}
        <div className="loading-ring"></div>
        
        {/* Glitch Efektli İsim */}
        <h2 className="loading-text" data-text="M.Mustakov">
          M.Mustakov
        </h2>
        
        {/* Yükleniyor Çubuğu */}
        <div className="loading-bar-container">
          <div className="loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;