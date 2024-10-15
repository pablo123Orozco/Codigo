import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';


// Definir el tipo de las props
interface NavbarProps {
  isSidebarOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen }) => {
  return (
    <header className={`header${isSidebarOpen ? ' header--shift' : ''}`}>
      <div className="logo-container">
        
      </div>
      <nav className="navbar navbar-expand-lg navbar-custom">
        <ul className="navbar-nav mr-auto nav-container">
          <li className="nav-item">
            <span className="nav-link">Inicio</span>
          </li>
          <li className="nav-item">
            <span className="nav-link">Noticias</span>
          </li>
          <li className="nav-item">
            <span className="nav-link">Información Pública en Línea</span>
          </li>
          <li className="nav-item dropdown">
            <span className="nav-link dropdown-toggle">Hospital</span>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
