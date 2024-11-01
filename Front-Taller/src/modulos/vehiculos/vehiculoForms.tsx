import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Alert } from 'react-bootstrap';

interface Vehiculo {
  id?: number;
  marca: string;
  modelo: string;
  placa: string;
  estadoActual: string;
  year: string;
}

interface VehiculoFormProps {
  vehiculoToEdit: Vehiculo | null;
  onSave: () => void;
}

const VehiculoForm: React.FC<VehiculoFormProps> = ({ vehiculoToEdit, onSave }) => {
  const [formData, setFormData] = useState<Vehiculo>({
    marca: '',
    modelo: '',
    placa: '',
    estadoActual: '',
    year: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (vehiculoToEdit) {
      setFormData(vehiculoToEdit);
    }
  }, [vehiculoToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'year') {
      // Validación para el campo "year": solo permite dígitos y un máximo de 4 caracteres
      if (/^\d*$/.test(value) && value.length <= 4) {
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, year: '' });
      } else if (value.length > 4) {
        setErrors({ ...errors, year: 'El año debe tener exactamente 4 dígitos' });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field as keyof Vehiculo]) {
        newErrors[field] = `El campo ${field} es requerido`;
      }
    });

    if (formData.year && formData.year.length !== 4) {
      newErrors.year = 'El año debe tener exactamente 4 dígitos';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (vehiculoToEdit) {
        await axios.put(`http://localhost:4000/api/vehiculos/${vehiculoToEdit.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/vehiculos', formData);
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="form-horizontal">
      <Row>
        <Col>
          <Form.Group controlId="marca">
            <Form.Label>Marca</Form.Label>
            <Form.Control
              type="text"
              name="marca"
              value={formData.marca}
              placeholder="Marca"
              onChange={handleChange}
            />
            {errors.marca && <Alert variant="danger">{errors.marca}</Alert>}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="modelo">
            <Form.Label>Modelo</Form.Label>
            <Form.Control
              type="text"
              name="modelo"
              value={formData.modelo}
              placeholder="Modelo"
              onChange={handleChange}
            />
            {errors.modelo && <Alert variant="danger">{errors.modelo}</Alert>}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="placa">
            <Form.Label>Placa</Form.Label>
            <Form.Control
              type="text"
              name="placa"
              value={formData.placa}
              placeholder="Placa"
              onChange={handleChange}
            />
            {errors.placa && <Alert variant="danger">{errors.placa}</Alert>}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="estadoActual">
            <Form.Label>Estado Actual</Form.Label>
            <Form.Control
              type="text"
              name="estadoActual"
              value={formData.estadoActual}
              placeholder="Estado Actual"
              onChange={handleChange}
            />
            {errors.estadoActual && <Alert variant="danger">{errors.estadoActual}</Alert>}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="year">
            <Form.Label>Año</Form.Label>
            <Form.Control
              type="text"
              name="year"
              value={formData.year}
              placeholder="Año"
              onChange={handleChange}
            />
            {errors.year && <Alert variant="danger">{errors.year}</Alert>}
          </Form.Group>
        </Col>
      </Row>
      <button type="submit" className="btn btn-primary mt-3">
        {vehiculoToEdit ? 'Actualizar' : 'Agregar'}
      </button>
    </Form>
  );
};

export default VehiculoForm;
