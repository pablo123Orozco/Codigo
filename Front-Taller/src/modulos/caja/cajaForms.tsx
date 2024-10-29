import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';

interface Caja {
  id?: number;
  concepto: string;
  monto: number;
  tipo: string;
  fecha: string;  
}

interface CajaFormProps {
  cajaToEdit?: Caja | null;
  onSave?: () => void;
  setShowSuccessModal?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CajaForm: React.FC<CajaFormProps> = ({ cajaToEdit, onSave, setShowSuccessModal }) => {
  const [formData, setFormData] = useState<Caja>({
    concepto: '',
    monto: 0,
    tipo: '',
    fecha: '',
  });

  useEffect(() => {
    if (cajaToEdit) {
      setFormData(cajaToEdit);
    }
  }, [cajaToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'monto' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (cajaToEdit?.id) {
        await axios.put(`http://localhost:4000/api/caja/${cajaToEdit.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/caja', formData);
      }
      if (onSave) onSave();
      if (setShowSuccessModal) setShowSuccessModal(true);
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

      <Button type="submit" className="btn btn-primary">
        {cajaToEdit ? 'Actualizar Registro de Caja' : 'Crear Registro de Caja'}
      </Button>
    </Form>
  );
};

export default CajaForm;
 