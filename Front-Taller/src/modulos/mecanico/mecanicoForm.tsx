import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap';

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      <button type="submit" className="btn btn-submit">
        {mecanicoToEdit ? 'Actualizar' : 'Agregar'}
      </button>
    </Form>
  );
};

export default MecanicoForm;
