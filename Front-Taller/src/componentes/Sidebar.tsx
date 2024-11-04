// Sidebar.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBars, faTimes, faCogs, faUser, faTable, faList, 
  faCar, faClipboard, faShoppingCart, faHome, faToolbox, 
  faBriefcase,  faAngleDown, faAngleUp, faWrench 
} from '@fortawesome/free-solid-svg-icons';
import './sidebar.css';

interface SidebarProps {
  toggleSidebar: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false); // Estado para el menú de reportes

  const handleTrigger = () => {
    setIsOpen(!isOpen);
    toggleSidebar(!isOpen);
  };

  const toggleWorkMenu = () => {
    setIsWorkOpen(!isWorkOpen);
  };

  const toggleReportsMenu = () => {
    setIsReportsOpen(!isReportsOpen);
  };

  return (
    <div className={`sidebar d-flex flex-column${isOpen ? ' sidebar--open' : ''}`}>
      <div className="trigger p-3" onClick={handleTrigger}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
      </div>

      <div className="sidebar-items mt-4">
        <div className="sidebar-position mb-3">
          <FontAwesomeIcon icon={faHome} className="me-2" />
          {isOpen && (
            <Link to="/dashboard" className="text-decoration-none">
              <span className="link-text">Menu</span>
            </Link>
          )}
        </div>

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

        {/* Sección de Trabajo con submenús */}
        <div className="sidebar-position mb-3" onClick={toggleWorkMenu}>
          <FontAwesomeIcon icon={faBriefcase} className="me-2" />
          {isOpen && (
            <>
              <span className="link-text">Trabajo</span>
              <FontAwesomeIcon icon={isWorkOpen ? faAngleUp : faAngleDown} className="ms-2" />
            </>
          )}
        </div>

        {isWorkOpen && isOpen && (
          <div className="ms-4">
            <div className="sidebar-position mb-3">
              <FontAwesomeIcon icon={faClipboard} className="me-2" />
              <Link to="/ordenes" className="text-decoration-none">
                <span className="link-text">Órdenes de Servicio</span>
              </Link>
            </div>
            <div className="sidebar-position mb-3">
              <FontAwesomeIcon icon={faToolbox} className="me-2" />
              <Link to="/servicios" className="text-decoration-none">
                <span className="link-text">Servicios</span>
              </Link>
            </div>
            <div className="sidebar-position mb-3">
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              <Link to="/compras" className="text-decoration-none">
                <span className="link-text">Compras</span>
              </Link>
            </div>
            
            <div className="sidebar-position mb-3">
              <FontAwesomeIcon icon={faWrench} className="me-2" />
              <Link to="/mecanico" className="text-decoration-none">
                <span className="link-text">Mecánico</span>
              </Link>
            </div>
          </div>
        )}

        {/* Módulo de Reportes con Submenú */}
        <div className="sidebar-position mb-3" onClick={toggleReportsMenu}>
          <FontAwesomeIcon icon={faList} className="me-2" />
          {isOpen && (
            <>
              <span className="link-text">Reportes</span>
              <FontAwesomeIcon icon={isReportsOpen ? faAngleUp : faAngleDown} className="ms-2" />
            </>
          )}
        </div>

        {isReportsOpen && isOpen && (
          <div className="ms-4">
            <div className="sidebar-position mb-3">
              <FontAwesomeIcon icon={faClipboard} className="me-2" />
              <Link to="/reportes/clientes" className="text-decoration-none">
                <span className="link-text">Clientes</span>
              </Link>
            </div>
            <div className="sidebar-position mb-3">
              <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
              <Link to="/reportes/compras" className="text-decoration-none">
                <span className="link-text">Compras</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
