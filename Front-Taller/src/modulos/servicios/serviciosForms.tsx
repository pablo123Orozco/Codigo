import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Col, Row, Alert } from 'react-bootstrap';

interface Servicio {
  id?: number;
  servicio: string;
  costo_mano_obra: number;
  precio_repuesto: number;
  precio_total: number;
  descripcion: string;
}

interface ServicioFormProps {
  servicioToEdit: Servicio | null;
  onSave: () => void;
}

const ServicioForm: React.FC<ServicioFormProps> = ({ servicioToEdit, onSave }) => {
  const [formData, setFormData] = useState<Servicio>({
    servicio: '',
    costo_mano_obra: 0,
    precio_repuesto: 0,
    precio_total: 0,
    descripcion: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (servicioToEdit) {
      setFormData(servicioToEdit);
    }
  }, [servicioToEdit]);

  useEffect(() => {
    const costoManoObra = isNaN(formData.costo_mano_obra) ? 0 : formData.costo_mano_obra;
    const precioRepuesto = isNaN(formData.precio_repuesto) ? 0 : formData.precio_repuesto;
    setFormData((prevData) => ({ ...prevData, precio_total: costoManoObra + precioRepuesto }));
  }, [formData.costo_mano_obra, formData.precio_repuesto]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    if (type === 'number') {
      const parsedValue = parseFloat(value);
      setFormData({
        ...formData,
        [name]: isNaN(parsedValue) ? 0 : parsedValue,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: '' }); // Limpia el error al editar un campo
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((field) => {
      if (formData[field as keyof Servicio] === '' || formData[field as keyof Servicio] === 0) {
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
      if (servicioToEdit) {
        await axios.put(`http://localhost:4000/api/servicios/${servicioToEdit.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/servicios', formData);
      }
      onSave(); // Activa el modal de éxito al guardar sin usar alert()
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group controlId="servicio">
            <Form.Label>Nombre del Servicio</Form.Label>
            <Form.Control
              type="text"
              name="servicio"
              placeholder="Ingrese el nombre del servicio"
              value={formData.servicio}
              onChange={handleChange}
            />
            {errors.servicio && <Alert variant="danger">{errors.servicio}</Alert>}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="costo_mano_obra">
            <Form.Label>Costo de Mano de Obra</Form.Label>
            <Form.Control
              type="number"
              name="costo_mano_obra"
              placeholder="Ingrese el costo de mano de obra"
              value={formData.costo_mano_obra || ''}
              onChange={handleChange}
            />
            {errors.costo_mano_obra && <Alert variant="danger">{errors.costo_mano_obra}</Alert>}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="precio_repuesto">
            <Form.Label>Precio de Repuestos</Form.Label>
            <Form.Control
              type="number"
              name="precio_repuesto"
              placeholder="Ingrese el precio de los repuestos"
              value={formData.precio_repuesto || ''}
              onChange={handleChange}
            />
            {errors.precio_repuesto && <Alert variant="danger">{errors.precio_repuesto}</Alert>}
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="precio_total">
            <Form.Label>Precio Total</Form.Label>
            <Form.Control
              type="number"
              name="precio_total"
              placeholder="Precio total"
              value={formData.precio_total || 0}
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group controlId="descripcion">
            <Form.Label>Descripción del Servicio</Form.Label>
            <Form.Control
              type="text"
              name="descripcion"
              placeholder="Descripción del servicio"
              value={formData.descripcion}
              onChange={handleChange}
            />
            {errors.descripcion && <Alert variant="danger">{errors.descripcion}</Alert>}
          </Form.Group>
        </Col>
      </Row>
      <Button type="submit" variant="primary">
        {servicioToEdit ? 'Actualizar' : 'Agregar'} Servicio
      </Button>
    </Form>
  );
};

export default ServicioForm;
