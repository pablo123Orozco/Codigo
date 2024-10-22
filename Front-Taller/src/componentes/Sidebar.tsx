import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faCogs, faUser, faTable, faList, faCar, faClipboard, faShoppingCart, faHome, faToolbox, faBriefcase, faCashRegister, faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons'; // Añadimos faCashRegister
import './sidebar.css';

interface SidebarProps {
  toggleSidebar: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isWorkOpen, setIsWorkOpen] = useState(false); // Estado para controlar el despliegue de "Trabajo"

  const handleTrigger = () => {
    setIsOpen(!isOpen);
    toggleSidebar(!isOpen);
  };

  const toggleWorkMenu = () => {
    setIsWorkOpen(!isWorkOpen);
  };

  return (
    <div className={`sidebar d-flex flex-column${isOpen ? ' sidebar--open' : ''}`}>
      <div className="trigger p-3" onClick={handleTrigger}>
        <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
      </div>

      <div className="sidebar-items mt-4">
        {/* Botón para ir al Dashboard */}
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

        {/* Nueva sección para Trabajo */}
        <div className="sidebar-position mb-3" onClick={toggleWorkMenu}>
          <FontAwesomeIcon icon={faBriefcase} className="me-2" />
          {isOpen && (
            <>
              <span className="link-text">Trabajo</span>
              <FontAwesomeIcon icon={isWorkOpen ? faAngleUp : faAngleDown} className="ms-2" />
            </>
          )}
        </div>

        {/* Submenús dentro de Trabajo, que solo se muestran cuando isWorkOpen es true */}
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
            {/* Añadimos el módulo de Caja */}
            <div className="sidebar-position mb-3">
              <FontAwesomeIcon icon={faCashRegister} className="me-2" />
              <Link to="/caja" className="text-decoration-none">
                <span className="link-text">Caja</span>
              </Link>
            </div>
          </div>
        )}

        <div className="sidebar-position mb-3">
          <FontAwesomeIcon icon={faList} className="me-2" />
          {isOpen && <span className="link-text">Reportes</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
