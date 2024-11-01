import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
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
  setShowSuccessModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (clienteToEdit) {
      setFormData(clienteToEdit);
    }
  }, [clienteToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'telefono') {
      if (/^\d*$/.test(value) && value.length <= 8) { // Solo permite dígitos y máximo 8 caracteres
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, telefono: '' });
      } else if (value.length > 8) {
        setErrors({ ...errors, telefono: 'El teléfono debe tener exactamente 8 dígitos' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field as keyof Cliente]) {
        newErrors[field] = `El campo ${field} es requerido`;
      }
    });
    if (formData.telefono && formData.telefono.length !== 8) {
      newErrors.telefono = 'El teléfono debe tener exactamente 8 dígitos';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (clienteToEdit) {
        await axios.put(`http://localhost:4000/api/clientes/${clienteToEdit.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/clientes', formData);
      }
      onSave();
      setShowSuccessModal(true);
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
              {errors.nombre && <Alert variant="danger">{errors.nombre}</Alert>}
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
              {errors.apellido && <Alert variant="danger">{errors.apellido}</Alert>}
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
              {errors.nit && <Alert variant="danger">{errors.nit}</Alert>}
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
              {errors.telefono && <Alert variant="danger">{errors.telefono}</Alert>}
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
              {errors.correo && <Alert variant="danger">{errors.correo}</Alert>}
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
              {errors.estadoCuenta && <Alert variant="danger">{errors.estadoCuenta}</Alert>}
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
