import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import './clientes.css';

interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  nit: string;
  telefono: string;
  correo: string;
  estadoCuenta: string;
}

interface ClienteFormProps {
  clienteToEdit: Cliente | null;
  onSave: () => void;
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>; // Nueva prop para el modal de éxito
}

const ClienteForm: React.FC<ClienteFormProps> = ({ clienteToEdit, onSave, setShowSuccessModal }) => {
  const [formData, setFormData] = useState<Cliente>({
    nombre: '',
    apellido: '',
    nit: '',
    telefono: '',
    correo: '',
    estadoCuenta: '',
  });

  useEffect(() => {
    if (clienteToEdit) {
      setFormData({
        id: clienteToEdit.id,
        nombre: clienteToEdit.nombre,
        apellido: clienteToEdit.apellido,
        nit: clienteToEdit.nit,
        telefono: clienteToEdit.telefono,
        correo: clienteToEdit.correo,
        estadoCuenta: clienteToEdit.estadoCuenta,
      });
    }
  }, [clienteToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (clienteToEdit) {
        await axios.put(`http://localhost:4000/api/clientes/${clienteToEdit.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/clientes', formData);
      }
      onSave(); // Llama a onSave para actualizar el estado del componente padre
      setShowSuccessModal(true); // Muestra el modal de éxito
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  };

  return (
    <Container>
      <h2>{clienteToEdit ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                placeholder="Apellido"
                value={formData.apellido}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group controlId="nit">
              <Form.Label>NIT</Form.Label>
            <Form.Control
              type="text"
              name="nit"
              placeholder="NIT"
              value={formData.nit}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="telefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group controlId="correo">
            <Form.Label>Correo</Form.Label>
            <Form.Control
              type="email"
              name="correo"
              placeholder="Correo"
              value={formData.correo}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="estadoCuenta">
            <Form.Label>Estado de Cuenta</Form.Label>
            <Form.Control
              type="text"
              name="estadoCuenta"
              placeholder="Estado de Cuenta"
              value={formData.estadoCuenta}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button variant="primary" type="submit" className="mt-3">
        {clienteToEdit ? 'Actualizar' : 'Agregar'}
      </Button>
    </Form>
  </Container>
);
};

export default ClienteForm;
