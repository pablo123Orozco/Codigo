import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap';

interface Mecanico {
  mecanicoId?: number;
  nombre: string;
  fecha: string;
}

interface OrdenService {
  id: number;
  detalleReparacion: string;
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

  const [ordenesServicio, setOrdenesServicio] = useState<OrdenService[]>([]);

  useEffect(() => {
    // Cargar órdenes de servicio
    const fetchOrdenesServicio = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/ordenes');
        setOrdenesServicio(response.data.body);
      } catch (error) {
        console.error('Error al obtener las órdenes de servicio:', error);
      }
    };

    fetchOrdenesServicio();

    if (mecanicoToEdit) {
      setFormData({
        mecanicoId: mecanicoToEdit.mecanicoId,
        nombre: mecanicoToEdit.nombre,
        fecha: mecanicoToEdit.fecha,
      });
    }
  }, [mecanicoToEdit]);

  // Type guard para manejar los diferentes tipos de elementos correctamente
  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mecanicoToEdit && mecanicoToEdit.mecanicoId) {
        await axios.put(`http://localhost:4000/api/mecanico/${mecanicoToEdit.mecanicoId}`, formData);
        alert('Mecánico actualizado');
      } else {
        await axios.post('http://localhost:4000/api/mecanico', formData);
        alert('Mecánico creado');
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
