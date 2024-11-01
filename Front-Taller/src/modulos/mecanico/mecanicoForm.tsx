import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

interface Mecanico {
  mecanicoId?: number;
  nombre: string;
  fecha: string;
}

interface MecanicoFormProps {
  mecanicoToEdit: Mecanico | null;
  onSave: () => void;
}

const MecanicoForm: React.FC<MecanicoFormProps> = ({ mecanicoToEdit, onSave }) => {
  const [formData, setFormData] = useState<Mecanico>({
    nombre: '',
    fecha: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (mecanicoToEdit) {
      const formattedDate = mecanicoToEdit.fecha.split('T')[0]; // Extrae solo la fecha en formato YYYY-MM-DD
      setFormData({
        mecanicoId: mecanicoToEdit.mecanicoId,
        nombre: mecanicoToEdit.nombre,
        fecha: formattedDate,
      });
    }
  }, [mecanicoToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Limpia el error al editar el campo
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((field) => {
      if (formData[field as keyof Mecanico] === '') {
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
      if (mecanicoToEdit && mecanicoToEdit.mecanicoId) {
        await axios.put(`http://localhost:4000/api/mecanico/${mecanicoToEdit.mecanicoId}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/mecanico', formData);
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar el mecánico:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="form-horizontal">
      <Row>
        <Col>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={formData.nombre}
              placeholder="Nombre"
              onChange={handleChange}
            />
            {errors.nombre && <Alert variant="danger">{errors.nombre}</Alert>}
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

      <Button type="submit" className="btn btn-submit">
        {mecanicoToEdit ? 'Actualizar' : 'Agregar'}
      </Button>
    </Form>
  );
};

export default MecanicoForm;
