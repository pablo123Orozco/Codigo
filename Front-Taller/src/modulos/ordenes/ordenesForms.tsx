import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Orden {
  id?: number;
  detalleReparacion: string;
  costoEstimado: number;
  estado: string;
  idVehiculo: string | number;
  idCliente: string | number;
  idMecanico: string | number;
  concepto: string;
  combustible: string;
  tipoPago: string;
  estadoPago: string;
  idServicio: string | number;
  adelantoEmpresa: number;
  fechaIngreso: string;
}

interface Cliente {
  id: number;
  nombre: string;
}

interface Vehiculo {
  id: number;
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

interface OrdenFormProps {
  ordenToEdit: Orden | null;
  onSave: () => void;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
}


const OrdenForm: React.FC<OrdenFormProps> = ({ ordenToEdit, onSave, setShowSuccessModal }) => {
  const [formData, setFormData] = useState<Orden>({
    detalleReparacion: '',
    costoEstimado: 0,
    estado: '',
    idVehiculo: '',
    idCliente: '',
    idMecanico: '',
    concepto: '',
    combustible: '',
    tipoPago: '',
    estadoPago: '',
    idServicio: '',
    adelantoEmpresa: 0,
    fechaIngreso: '',
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (ordenToEdit) {
      const fechaFormateada = ordenToEdit.fechaIngreso
        ? new Date(ordenToEdit.fechaIngreso).toISOString().split("T")[0]
        : '';
      setFormData({
        ...ordenToEdit,
        fechaIngreso: fechaFormateada,
      });
    }

    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/clientes');
        setClientes(response.data.body);
      } catch (error) {
        console.error('Error al obtener clientes: ', error);
      }
    };

    const fetchVehiculos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/vehiculos');
        setVehiculos(response.data.body);
      } catch (error) {
        console.error('Error al obtener vehículos: ', error);
      }
    };

    const fetchMecanicos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/mecanico');
        setMecanicos(response.data.body);
      } catch (error) {
        console.error('Error al obtener mecánicos: ', error);
      }
    };

    const fetchServicios = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/servicios');
        setServicios(response.data.body);
      } catch (error) {
        console.error('Error al obtener servicios: ', error);
      }
    };

    fetchClientes();
    fetchVehiculos();
    fetchMecanicos();
    fetchServicios();
  }, [ordenToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "costoEstimado" || name === "adelantoEmpresa" ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://localhost:4000/api/ordenes/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/ordenes', formData);
      }
      setShowSuccessModal(true);
      onSave();
    } catch (error) {
      console.error('Error al guardar la orden:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="form-horizontal">
      <Row>
        <Col>
          <Form.Group controlId="detalleReparacion">
            <Form.Label>Reparación</Form.Label>
            <Form.Control
              type="text"
              name="detalleReparacion"
              value={formData.detalleReparacion || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="fechaIngreso">
            <Form.Label>Fecha de Ingreso</Form.Label>
            <Form.Control
              type="date"
              name="fechaIngreso"
              value={formData.fechaIngreso || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
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
                  {vehiculo.modelo}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
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
          <Form.Group controlId="concepto">
            <Form.Label>Concepto</Form.Label>
            <Form.Control
              type="text"
              name="concepto"
              value={formData.concepto || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="combustible">
            <Form.Label>Combustible</Form.Label>
            <Form.Control
              type="text"
              name="combustible"
              value={formData.combustible || ''}
              onChange={handleChange}
            />
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
              value={formData.costoEstimado || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="adelantoEmpresa">
            <Form.Label>Adelanto Empresa</Form.Label>
            <Form.Control
              type="number"
              name="adelantoEmpresa"
              value={formData.adelantoEmpresa || ''}
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
              type="text"
              name="tipoPago"
              value={formData.tipoPago || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="estadoPago">
            <Form.Label>Estado del Pago</Form.Label>
            <Form.Control
              type="text"
              name="estadoPago"
              value={formData.estadoPago || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="estado">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              name="estado"
              value={formData.estado || ''}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Button type="submit" className="btn btn-primary">
        {ordenToEdit ? 'Actualizar Orden' : 'Crear Orden'}
      </Button>
    </Form>
  );
};

export default OrdenForm;
