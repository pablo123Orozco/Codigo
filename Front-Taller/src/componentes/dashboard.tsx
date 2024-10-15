import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './Sidebar';
import './dashboard.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [ordenesCount, setOrdenesCount] = useState<number>(0);  // Estado para las órdenes de servicio
  const [vehiculosCount, setVehiculosCount] = useState<number>(0);  // Estado para los vehículos registrados

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  // Función para obtener el conteo de las órdenes de servicio y vehículos registrados desde el backend
  const fetchData = async () => {
    try {
      // Llamada para obtener todas las órdenes de servicio
      const ordenesResponse = await axios.get('http://localhost:4000/api/ordenes');
      const ordenes = ordenesResponse.data.body; // Accedemos al array en el campo "body"
      setOrdenesCount(ordenes.length); // Contamos cuántas órdenes hay

      // Llamada para obtener todos los vehículos registrados (modifica este endpoint si es necesario)
      const vehiculosResponse = await axios.get('http://localhost:4000/api/vehiculos'); // Asume que existe un endpoint de vehículos
      const vehiculos = vehiculosResponse.data.body; // Asumiendo que "vehiculos" está en la propiedad "body"
      setVehiculosCount(vehiculos.length); // Contamos cuántos vehículos hay
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  // Hook para ejecutar la función cuando el componente se monta
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <Navbar isSidebarOpen={isSidebarOpen} />
      <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
        <Sidebar toggleSidebar={toggleSidebar} />

        <div className="content p-4">
          <h1 className="mb-4">Bienvenido al Dashboard</h1>

          {/* Tarjetas de resumen con datos del backend */}
          <Container fluid>
            <Row>
              <Col md={4}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <Card.Title>Órdenes de Servicio</Card.Title>
                    <Card.Text>{ordenesCount} Órdenes</Card.Text> {/* Mostramos el conteo real de órdenes */}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <Card.Title>Vehículos Registrados</Card.Title>
                    <Card.Text>{vehiculosCount} Vehículos</Card.Text> {/* Mostramos el conteo real de vehículos */}
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <Card.Title>Ganancias Mensuales</Card.Title>
                    <Card.Text>$24,000</Card.Text> {/* Aquí puedes agregar el cálculo real de las ganancias */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Sección para gráficos, si es necesario */}
            <Row>
              <Col md={12}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <Card.Title>Gráfico de Ganancias</Card.Title>
                    {/* Aquí puedes agregar un gráfico usando librerías como Chart.js */}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
