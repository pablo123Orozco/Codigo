import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap'; // Usamos Bootstrap para diseño

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

  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    if (compraToEdit) {
      const fechaFormateada = new Date(compraToEdit.fecha).toISOString().split('T')[0];
      setFormData({
        ...compraToEdit,
        fecha: fechaFormateada,
      });
    }

    // Obtener la lista de proveedores
    const fetchProveedores = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/proveedor');
        setProveedores(response.data.body);
      } catch (error) {
        console.error('Error al obtener proveedores:', error);
      }
    };

    // Obtener la lista de clientes
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://localhost:4000/api/compras/${formData.id}`, formData);
        alert('Compra actualizada con éxito');
      } else {
        await axios.post('http://localhost:4000/api/compras', formData);
        alert('Compra creada con éxito');
      }
      onSave();
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
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="idProveedor">
            <Form.Label>Proveedor</Form.Label>
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

      <Form.Group controlId="marcha">
        <Form.Label>Marcha</Form.Label>
        <Form.Control
          type="text"
          name="marcha"
          value={formData.marcha}
          onChange={handleChange}
        />
      </Form.Group>

      <button type="submit" className="btn btn-submit">
        {compraToEdit ? 'Actualizar Compra' : 'Crear Compra'}
      </button>
    </Form>
  );
};

export default CompraForm;
