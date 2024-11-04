// Dashboard.js
import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Sidebar from './Sidebar';
import './dashboard.css';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import OrdenesPorEstadoChart from '../modulos/reportes/OrdenesPorEstadoChart';
import ServiciosMasSolicitadosChart from '../modulos/reportes/GraficaServicios';
import ComprasPorMesChart from '../modulos/reportes/GraficaCompra';

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [ordenesCount, setOrdenesCount] = useState<number>(0);
  const [vehiculosCount, setVehiculosCount] = useState<number>(0);
  const [serviciosData, setServiciosData] = useState<number[]>([]);
  const [serviciosLabels, setServiciosLabels] = useState<string[]>([]);

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

      // Simulación de datos para "Servicios Más Solicitados"
      const serviciosResponse = await axios.get('http://localhost:4000/api/servicios'); // Ajusta la URL de acuerdo a tu API
      const servicios = serviciosResponse.data.body;
      setServiciosData(servicios.map(servicio => servicio.cantidad));
      setServiciosLabels(servicios.map(servicio => servicio.nombre));

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
          <h1 className="mb-4">Menu Principal</h1>
          <Container fluid>
            <Row>
              <Col md={4}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <Card.Title>Órdenes de Servicio</Card.Title>
                    <Card.Text>{ordenesCount} Órdenes</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <Card.Title>Vehículos Registrados</Card.Title>
                    <Card.Text>{vehiculosCount} Vehículos</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Gráficas */}
            <Row>
              <Col md={6}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <Card.Title>Órdenes por Estado</Card.Title>
                    <OrdenesPorEstadoChart />
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <Card.Title>Servicios Más Solicitados</Card.Title>
                    <ServiciosMasSolicitadosChart data={serviciosData} labels={serviciosLabels} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <Card.Title>Compras por Mes</Card.Title>
                    <ComprasPorMesChart />
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
