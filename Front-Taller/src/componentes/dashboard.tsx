import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './Sidebar';
import './dashboard.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [ordenesCount, setOrdenesCount] = useState<number>(0);  
  const [vehiculosCount, setVehiculosCount] = useState<number>(0); 

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };


  const fetchData = async () => {
    try {
      
      const ordenesResponse = await axios.get('http://localhost:4000/api/ordenes');
      const ordenes = ordenesResponse.data.body; 
      setOrdenesCount(ordenes.length); 

      
      const vehiculosResponse = await axios.get('http://localhost:4000/api/vehiculos'); 
      const vehiculos = vehiculosResponse.data.body; 
      setVehiculosCount(vehiculos.length); 
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  };

  
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
                    <Card.Text></Card.Text> {/* Aquí puedes agregar el cálculo real de las ganancias */}
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
