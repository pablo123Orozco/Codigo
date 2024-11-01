import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

interface Caja {
  id?: number;
  concepto: string;
  monto: number | null;
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
    monto: null,
    tipo: '',
    fecha: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (cajaToEdit) {
      setFormData(cajaToEdit);
    }
  }, [cajaToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'monto' ? (value === '' ? null : parseFloat(value)) : value,
    });
    setErrors({ ...errors, [name]: '' }); // Limpia el error al editar el campo
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((field) => {
      if (
        formData[field as keyof Caja] === '' ||
        (field === 'monto' && (formData.monto === null || formData.monto <= 0))
      ) {
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
            {errors.concepto && <Alert variant="danger">{errors.concepto}</Alert>}
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="monto">
            <Form.Label>Monto</Form.Label>
            <Form.Control
              type="number"
              name="monto"
              value={formData.monto !== null ? formData.monto : ''} // Asegura que no esté vacío al editar
              onChange={handleChange}
              placeholder="Ingrese el monto" // Placeholder para mayor claridad
            />
            {errors.monto && <Alert variant="danger">{errors.monto}</Alert>}
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
            {errors.tipo && <Alert variant="danger">{errors.tipo}</Alert>}
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

      <Button type="submit" className="btn btn-primary">
        {cajaToEdit ? 'Actualizar Registro de Caja' : 'Crear Registro de Caja'}
      </Button>
    </Form>
  );
};

export default CajaForm;
