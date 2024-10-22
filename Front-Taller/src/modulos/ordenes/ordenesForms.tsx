import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';

interface OrdenService {
    id?: number;
    detalleReparacion: string;
    costoEstimado: number;
    estado: string;
    idVehiculo: number;
    concepto: string;
    combustible: string;
    idCliente: number;
    idMecanico: number;
    idServicio: number | string;
    fechaIngreso: string;
    tipoPago: string;
    estadoPago: string;
    adelantoEmpresa: number;
}

interface Cliente {
    id: number;
    nombre: string;
}

interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
}

interface Mecanico {
    id: number;
    nombre: string;
}

interface Servicio {
    id: number;
    servicio: string;
}

const OrdenServiceForm: React.FC = () => {
    const location = useLocation();
    const ordenToEdit = location.state?.ordenToEdit as OrdenService | null;

    const [formData, setFormData] = useState<OrdenService>({
        detalleReparacion: ordenToEdit?.detalleReparacion || '',
        costoEstimado: ordenToEdit?.costoEstimado || 0,
        estado: ordenToEdit?.estado || '',
        idVehiculo: ordenToEdit?.idVehiculo || 0,
        concepto: ordenToEdit?.concepto || 'REPARACIÓN',
        combustible: ordenToEdit?.combustible || 'Bajo',
        idCliente: ordenToEdit?.idCliente || 0,
        idMecanico: ordenToEdit?.idMecanico || 0,
        idServicio: ordenToEdit?.idServicio || '',
        fechaIngreso: ordenToEdit?.fechaIngreso || '',
        tipoPago: ordenToEdit?.tipoPago || 'Efectivo',
        estadoPago: ordenToEdit?.estadoPago || 'Pendiente',
        adelantoEmpresa: ordenToEdit?.adelantoEmpresa || 0,
    });

    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
    const [servicios, setServicios] = useState<Servicio[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesData, vehiculosData, mecanicosData, serviciosData] = await Promise.all([
                    axios.get('http://localhost:4000/api/clientes'),
                    axios.get('http://localhost:4000/api/vehiculos'),
                    axios.get('http://localhost:4000/api/mecanico'),
                    axios.get('http://localhost:4000/api/servicios')
                ]);
                setClientes(clientesData.data.body);
                setVehiculos(vehiculosData.data.body);
                setMecanicos(mecanicosData.data.body);
                setServicios(serviciosData.data.body);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<any>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'idMecanico' || name === 'idVehiculo' || name === 'idCliente' || name === 'idServicio' || name === 'adelantoEmpresa'
                ? parseInt(value)
                : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (ordenToEdit) {
                await axios.put(`http://localhost:4000/api/ordenes/${ordenToEdit.id}`, formData);
                alert('Orden de servicio actualizada');
            } else {
                await axios.post('http://localhost:4000/api/ordenes', formData);
                alert('Orden de servicio creada');
            }
            navigate('/ordenes');
        } catch (error) {
            console.error('Error al guardar la orden de servicio:', error);
        }
    };

    const toggleSidebar = (isOpen: boolean): void => {
        setIsSidebarOpen(isOpen);
    };

    return (
        <div className="dashboard-wrapper">
            <Navbar isSidebarOpen={isSidebarOpen} />
            <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
                <Sidebar toggleSidebar={toggleSidebar} />
                <div className="content">
                    <Form onSubmit={handleSubmit} className="form-horizontal">
                        <Row>
                            <Col>
                                <Form.Group controlId="detalleReparacion">
                                    <Form.Label>Detalle de Reparación</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="detalleReparacion"
                                        value={formData.detalleReparacion}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="idCliente">
                                    <Form.Label>Cliente</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="idCliente"
                                        value={formData.idCliente || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar Cliente</option>
                                        {clientes.map((cliente) => (
                                            <option key={`cliente-${cliente.id}`} value={cliente.id}>
                                                {cliente.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="idVehiculo">
                                    <Form.Label>Vehículo</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="idVehiculo"
                                        value={formData.idVehiculo || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar Vehículo</option>
                                        {vehiculos.map((vehiculo) => (
                                            <option key={`vehiculo-${vehiculo.id}`} value={vehiculo.id}>
                                                {vehiculo.marca} {vehiculo.modelo} - {vehiculo.placa}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="idMecanico">
                                    <Form.Label>Mecánico</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="idMecanico"
                                        value={formData.idMecanico || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar Mecánico</option>
                                        {mecanicos.map((mecanico) => (
                                            <option key={`mecanico-${mecanico.id}`} value={mecanico.id}>
                                                {mecanico.nombre}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="idServicio">
                                    <Form.Label>Servicio</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="idServicio"
                                        value={formData.idServicio || ''}
                                        onChange={handleChange}
                                    >
                                        <option value="">Seleccionar Servicio</option>
                                        {servicios.map((servicio) => (
                                            <option key={`servicio-${servicio.id}`} value={servicio.id}>
                                                {servicio.servicio}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="fechaIngreso">
                                    <Form.Label>Fecha de Ingreso</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="fechaIngreso"
                                        value={formData.fechaIngreso}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="tipoPago">
                                    <Form.Label>Tipo de Pago</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="tipoPago"
                                        value={formData.tipoPago}
                                        onChange={handleChange}
                                    >
                                        <option value="Efectivo">Efectivo</option>
                                        <option value="Cheque">Cheque</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="estadoPago">
                                    <Form.Label>Estado del Pago</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="estadoPago"
                                        value={formData.estadoPago}
                                        onChange={handleChange}
                                    >
                                        <option value="Pendiente">Pendiente</option>
                                        <option value="Anticipo">Anticipo</option>
                                        <option value="Pagado">Pagado</option>
                                        <option value="Deuda">Deuda</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="concepto">
                                    <Form.Label>Concepto</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="concepto"
                                        value={formData.concepto}
                                        onChange={handleChange}
                                    >
                                        <option value="REPARACIÓN">REPARACIÓN</option>
                                        <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="combustible">
                                    <Form.Label>Nivel de Combustible</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="combustible"
                                        value={formData.combustible}
                                        onChange={handleChange}
                                    >
                                        <option value="Alto">Alto</option>
                                        <option value="Medio">Medio</option>
                                        <option value="Bajo">Bajo</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                <Form.Group controlId="costoEstimado">
                                    <Form.Label>Costo Estimado</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="costoEstimado"
                                        value={formData.costoEstimado}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>

                            <Col>
                                <Form.Group controlId="adelantoEmpresa">
                                    <Form.Label>Adelanto de la Empresa</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="adelantoEmpresa"
                                        value={formData.adelantoEmpresa}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Button type="submit" className="btn btn-primary">
                            {ordenToEdit ? 'Actualizar Orden' : 'Agregar Orden'}
                        </Button>
                    </Form>
                </div>
            </div>
        </div>
    );
};

export default OrdenServiceForm;
