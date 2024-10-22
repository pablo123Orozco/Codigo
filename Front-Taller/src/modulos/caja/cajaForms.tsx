import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { FormControlElement } from 'react-bootstrap/FormControl';

interface Caja {
  id?: number;
  concepto: string;
  monto: number;
  tipo: string;
  fecha: string;
  idOrdenServicio?: number | null;
}

interface Orden {
  numeroOrden: number;
  detalleReparacion: string;
}

interface CajaFormProps {
  cajaToEdit?: Caja | null;
  onSave?: () => void;
}

const CajaForm: React.FC<CajaFormProps> = ({ cajaToEdit, onSave }) => {
  const [formData, setFormData] = useState<Caja>({
    concepto: '',
    monto: 0,
    tipo: '',
    fecha: '',
    idOrdenServicio: null,
  });

  const [ordenes, setOrdenes] = useState<Orden[]>([]);

  useEffect(() => {
    if (cajaToEdit) {
      const formattedDate = new Date(cajaToEdit.fecha).toISOString().split('T')[0]; // Formatear la fecha
      setFormData({ ...cajaToEdit, fecha: formattedDate });
    }

    const fetchOrdenes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/ordenes');
        console.log('Datos de órdenes recibidos:', response.data.body);
        setOrdenes(response.data.body);
      } catch (error) {
        console.error('Error al obtener órdenes de servicio:', error);
      }
    };

    fetchOrdenes();
  }, [cajaToEdit]);

  const handleChange = (e: React.ChangeEvent<FormControlElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'monto' || name === 'idOrdenServicio' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`http://localhost:4000/api/caja/${formData.id}`, formData);
        alert('Registro de caja actualizado');
      } else {
        await axios.post('http://localhost:4000/api/caja', formData);
        alert('Registro de caja creado');
      }
      if (onSave) onSave();
    } catch (error) {
      console.error('Error al guardar el registro de caja:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group controlId="concepto">
            <Form.Label>Concepto</Form.Label>
            <Form.Control
              type="text"
              name="concepto"
              value={formData.concepto}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="monto">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="tipo">
            <Form.Label>Tipo</Form.Label>
            <Form.Control
              as="select"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
            >
              <option value="">Seleccionar Tipo</option>
              <option value="Ingreso">Ingreso</option>
              <option value="Egreso">Egreso</option>
            </Form.Control>
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
          <Form.Group controlId="idOrdenServicio">
            <Form.Label>Orden de Servicio</Form.Label>
            <Form.Control
              as="select"
              name="idOrdenServicio"
              value={formData.idOrdenServicio || ''}
              onChange={handleChange}
            >
              <option value="">Seleccionar Orden de Servicio</option>
              {ordenes.map((orden) => (
                <option key={`orden-${orden.numeroOrden}`} value={orden.numeroOrden}>
                  {`Orden ${orden.numeroOrden}: ${orden.detalleReparacion}`}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>

      <Button type="submit" className="btn btn-primary">
        {cajaToEdit ? 'Actualizar Registro de Caja' : 'Crear Registro de Caja'}
      </Button>
    </Form>
  );
};

export default CajaForm;
