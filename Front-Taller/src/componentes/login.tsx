import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Importamos los iconos de ojo
import "./login.css"; // Importamos el archivo CSS para el estilo

import BackgroundImage from "../assets/Imagenes/background.png";
import Logo from "../assets/Imagenes/logo2.png";

const Login = () => {
  const [usuario, setUsuario] = useState<string>('');
  const [contraseña, setContraseña] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false); // Estado para mostrar/ocultar contraseña
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        usuario,
        contraseña,
      });

      // Desestructura token y rol de la respuesta
      const { token, rol } = response.data;

      // Guarda el token y el rol en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', rol); // Guardamos el rol para condicionar opciones en el Sidebar

      // Navega al dashboard después de iniciar sesión
      navigate('/dashboard');
    } catch (error) {
      setError('Error al iniciar sesión');
      setShow(true);
    }
    setLoading(false);
  };

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Overlay */}
      <div className="sign-in__backdrop"></div>
      {/* Form */}
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleLogin}>
        {/* Header */}
        <img
          className="logo mx-auto d-block mb-2"
          src={Logo}
          alt="logo"
        />
        <div className="h4 mb-2 text-center input-spacing">Login</div>
        
        {/* Error Alert */}
        {show && (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            {error}
          </Alert>
        )}
        
        <Form.Group className="input-spacing" controlId="username">
          <Form.Control
            type="text"
            value={usuario}
            placeholder="Usuario"
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="input-spacing password-input-group" controlId="password">
          <Form.Control
            type={showPassword ? "text" : "password"} // Cambia el tipo de input según el estado
            value={contraseña}
            placeholder="Contraseña"
            onChange={(e) => setContraseña(e.target.value)}
            required
          />
          <span
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)} // Cambia el estado para mostrar/ocultar
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Ícono de ojo */}
          </span>
        </Form.Group>

        {!loading ? (
          <Button className="w-100 mt-4" variant="primary" type="submit">
            Iniciar sesión
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Iniciando...
          </Button>
        )}
      </Form>

      {/* Footer 
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Made by Hendrik C | &copy;2022
      </div>
      */}
    </div>
  );
};

export default Login;
