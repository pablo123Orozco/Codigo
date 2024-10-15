import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importa Link para la navegación
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faCogs, faUser, faTable, faList, faCar, faClipboard, faShoppingCart, faWrench } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de una wrench para mecánicos
import './sidebar.css';

interface SidebarProps {
  toggleSidebar: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleTrigger = () => {
    setIsOpen(!isOpen);
    toggleSidebar(!isOpen);
  };

  return (
    <div className={`sidebar d-flex flex-column${isOpen ? ' sidebar--open' : ''}`}>
      <div className="trigger p-3" onClick={handleTrigger}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
      </div>

      <div className="sidebar-items mt-4">
        <div className="sidebar-position mb-3">
          <FontAwesomeIcon icon={faUser} className="me-2" />
          {isOpen && (
            <Link to="/usuarios" className="text-decoration-none">
              <span className="link-text">Usuarios</span>
            </Link>
          )}
        </div>
        <div className="sidebar-position mb-3">
          <FontAwesomeIcon icon={faCogs} className="me-2" />
          {isOpen && (
            <Link to="/clientes" className="text-decoration-none">
              <span className="link-text">Clientes</span>
            </Link>
          )}
        </div>
        <div className="sidebar-position mb-3">
          <FontAwesomeIcon icon={faTable} className="me-2" />
          {isOpen && (
            <Link to="/proveedores" className="text-decoration-none">
              <span className="link-text">Proveedores</span>
            </Link>
          )}
        </div>
        <div className="sidebar-position mb-3">
          <FontAwesomeIcon icon={faCar} className="me-2" />
          {isOpen && (
            <Link to="/vehiculos" className="text-decoration-none">
              <span className="link-text">Vehículos</span>
            </Link>
          )}
        </div>
        <div className="sidebar-position mb-3">
          <FontAwesomeIcon icon={faClipboard} className="me-2" />
          {isOpen && (
            <Link to="/ordenes" className="text-decoration-none">
              <span className="link-text">Órdenes de Servicio</span>
            </Link>
          )}
        </div>
        <div className="sidebar-position mb-3">
          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
          {isOpen && (
            <Link to="/compras" className="text-decoration-none">
              <span className="link-text">Compras</span>
            </Link>
          )}
        </div>
        <div className="sidebar-position mb-3">
          <FontAwesomeIcon icon={faWrench} className="me-2" />
          {isOpen && (
            <Link to="/mecanico" className="text-decoration-none">
              <span className="link-text">Mecánicos</span>
            </Link>
          )}
        </div>
        <div className="sidebar-position mb-3">
          <FontAwesomeIcon icon={faList} className="me-2" />
          {isOpen && <span className="link-text">Reportes</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
