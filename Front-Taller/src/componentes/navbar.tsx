import React from 'react';
import { useNavigate } from 'react-router-dom';  // Para redirigir al usuario
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  isSidebarOpen: boolean;
}

const CustomNavbar: React.FC<NavbarProps> = ({ isSidebarOpen }) => {
  const navigate = useNavigate(); // Hook de React Router para redirigir

  // Función que maneja el cierre de sesión
  const handleLogout = () => {
    // Eliminar el token del almacenamiento local (localStorage)
    localStorage.removeItem('token');

    // Redirigir al usuario a la página de inicio de sesión
    navigate('/login', { replace: true });

    // Opcional: Refrescar la página para evitar que el usuario pueda volver con el botón "Atrás"
    window.location.reload();
  };

  return (
    <header className={`header${isSidebarOpen ? ' header--shift' : ''}`}>
      <div className="logo-container">
        <img src="/path/to/logo.png"  />
      </div>
      <Navbar bg="light" expand="lg" className="navbar-custom">
        <Nav className="me-auto nav-container">
          <Nav.Link href="/noticias">Usuarios</Nav.Link>
          <Nav.Link href="/informacion-publica">Reportes</Nav.Link>
        </Nav>

        <Nav className="ml-auto">
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" id="dropdown-user" className="dropdown-user-toggle">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="custom-dropdown-menu">
              <Dropdown.Item href="/mi-perfil">Mi Perfil</Dropdown.Item>
              <Dropdown.Divider />
              {/* Llamar a handleLogout cuando el usuario haga clic en "Cerrar Sesión" */}
              <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>
    </header>
  );
};

export default CustomNavbar;
