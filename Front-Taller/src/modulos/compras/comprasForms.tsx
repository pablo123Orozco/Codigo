import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Compra {
  id?: number;
  nombreProducto: string;
  fecha: string;
  total: number;
  estado: string;
  idProveedor: number;
  idCliente: number;
  marcha: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

interface Cliente {
  id: number;
  nombre: string;
}

interface CompraFormProps {
  compraToEdit: Compra | null;
  onSave: () => void;
}

const CompraForm: React.FC<CompraFormProps> = ({ compraToEdit, onSave }) => {
  const [formData, setFormData] = useState<Compra>({
    nombreProducto: '',
    fecha: '',
    total: 0,
    estado: '',
    idProveedor: 0,
    idCliente: 0,
    marcha: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (compraToEdit) {
      const fechaFormateada = new Date(compraToEdit.fecha).toISOString().split('T')[0];
      setFormData({
        ...compraToEdit,
        fecha: fechaFormateada,
      });
    }

    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/proveedor');
        setProveedores(response.data.body);
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };

    const fetchClientes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/clientes');
        setClientes(response.data.body);
      } catch (error) {
        console.error('Error al obtener clientes:', error);
      }
    };

    fetchProveedores();
    fetchClientes();
  }, [compraToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Limpia el error al editar el campo
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((field) => {
      if (formData[field as keyof Compra] === '' || formData[field as keyof Compra] === 0) {
        newErrors[field] = `El campo ${field} es requerido`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (formData.id) {
        await axios.put(`http://localhost:4000/api/compras/${formData.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/compras', formData);
      }
      onSave(); // Llama a onSave para mostrar el mensaje de éxito desde el componente principal
    } catch (error) {
      console.error('Error al guardar la compra:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="form-horizontal">
      <Row>
        <Col>
          <Form.Group controlId="nombreProducto">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              name="nombreProducto"
              value={formData.nombreProducto}
              onChange={handleChange}
            />
            {errors.nombreProducto && <Alert variant="danger">{errors.nombreProducto}</Alert>}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="fecha">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
            />
            {errors.fecha && <Alert variant="danger">{errors.fecha}</Alert>}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="total">
            <Form.Label>Total</Form.Label>
            <Form.Control
              type="number"
              name="total"
              value={formData.total}
              onChange={handleChange}
            />
            {errors.total && <Alert variant="danger">{errors.total}</Alert>}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="estado">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            />
            {errors.estado && <Alert variant="danger">{errors.estado}</Alert>}
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="idProveedor">
            <Form.Label>Proveedor</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                as="select"
                name="idProveedor"
                value={formData.idProveedor || ''}
                onChange={handleChange}
              >
                <option value="">Seleccionar Proveedor</option>
                {proveedores.map((proveedor) => (
                  <option key={`proveedor-${proveedor.id}`} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </Form.Control>
              <Button variant="link" onClick={() => navigate('/proveedores')}>+</Button>
            </div>
            {errors.idProveedor && <Alert variant="danger">{errors.idProveedor}</Alert>}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="idCliente">
            <Form.Label>Cliente</Form.Label>
            <div className="d-flex align-items-center">
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
              <Button variant="link" onClick={() => navigate('/clientes')}>+</Button>
            </div>
            {errors.idCliente && <Alert variant="danger">{errors.idCliente}</Alert>}
          </Form.Group>
        </Col>
      </Row>

      <Form.Group controlId="marcha">
        <Form.Label>Marcha</Form.Label>
        <Form.Control
          type="text"
          name="marcha"
          value={formData.marcha}
          onChange={handleChange}
        />
        {errors.marcha && <Alert variant="danger">{errors.marcha}</Alert>}
      </Form.Group>

      <Button type="submit" variant="primary">
        {compraToEdit ? 'Actualizar Compra' : 'Crear Compra'}
      </Button>
    </Form>
  );
};

export default CompraForm;
