import React from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Asegúrate de importar Link correctamente
import { Navbar, Nav, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';
import Logo from '../assets/Imagenes/logo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

interface NavbarProps {
  isSidebarOpen: boolean;
}

const CustomNavbar: React.FC<NavbarProps> = ({ isSidebarOpen }) => {
  const navigate = useNavigate(); // Hook de React Router para redirigir

  // Función que maneja el cierre de sesión
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login', { replace: true });
    window.location.reload();
  };

  return (
    <header className={`header${isSidebarOpen ? ' header--shift' : ''}`}>
      <div className="logo-container">
        <img src={Logo} alt="logo" className="img-fluid" />
      </div>
      <Navbar expand="lg" className="navbar-custom">
        <Nav className="me-auto nav-container">
          <Nav.Link as={Link} to="/usuarios">Usuarios</Nav.Link>
          <Nav.Link as={Link} to="/reportes/clientes">Reportes</Nav.Link>  {/* Aquí usamos Link para redirección */}
        </Nav>

        <Nav className="ml-auto">
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" id="dropdown-user" className="dropdown-user-toggle">
              <FontAwesomeIcon icon={faUser} size="lg" />
            </Dropdown.Toggle>

            <Dropdown.Menu className="custom-dropdown-menu">
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleLogout}>Ayuda</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>
    </header>
  );
};

export default CustomNavbar;
 