// src/components/Navbar.jsx

import React from 'react';
import { Link } from 'react-router-dom'; // <a> yerine Link kullanacağız
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar glass-card">
      <div className="navbar-brand">
        <Link to="/">Muhammetjan </Link> {/* a -> Link, href -> to */}
      </div>
      <ul className="navbar-links">
        <li><Link to="/">Ana Sayfa</Link></li>
        <li><Link to="/hakkimda">Hakkımda</Link></li>
        <li><Link to="/iletisim">İletişim</Link></li> {/* Bu şimdilik bir yere gitmeyecek */}
      </ul>
    </nav>
  );
}

export default Navbar;