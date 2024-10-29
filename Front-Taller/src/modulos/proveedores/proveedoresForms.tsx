import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap';

interface Proveedor {
  id?: number;
  nombre: string;
  nit: string;
  dpi: string;
  razonSocial: string;
  telefono: string;
}

interface ProveedorFormProps {
  proveedorToEdit: Proveedor | null;
  onSave: () => void;
}

const ProveedorForm: React.FC<ProveedorFormProps> = ({ proveedorToEdit, onSave }) => {
  const [formData, setFormData] = useState<Proveedor>({
    nombre: '',
    nit: '',
    dpi: '',
    razonSocial: '',
    telefono: '',
  });

  useEffect(() => {
    if (proveedorToEdit) {
      setFormData({
        id: proveedorToEdit.id,
        nombre: proveedorToEdit.nombre,
        nit: proveedorToEdit.nit,
        dpi: proveedorToEdit.dpi,
        razonSocial: proveedorToEdit.razonSocial,
        telefono: proveedorToEdit.telefono,
      });
    }
  }, [proveedorToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (proveedorToEdit && proveedorToEdit.id) {
        await axios.put(`http://localhost:4000/api/proveedor/${proveedorToEdit.id}`, formData);
      } else {
        await axios.post('http://localhost:4000/api/proveedor', formData);
      }
      onSave(); // Llama a onSave para mostrar el mensaje de éxito en el módulo principal
    } catch (error) {
      console.error('Error al guardar proveedor:', error);
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
          <Form.Group controlId="nit">
            <Form.Label>NIT</Form.Label>
            <Form.Control
              type="text"
              name="nit"
              value={formData.nit}
              placeholder="NIT"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="dpi">
            <Form.Label>DPI</Form.Label>
            <Form.Control
              type="text"
              name="dpi"
              value={formData.dpi}
              placeholder="DPI"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="razonSocial">
            <Form.Label>Razón Social</Form.Label>
            <Form.Control
              type="text"
              name="razonSocial"
              value={formData.razonSocial}
              placeholder="Razón Social"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="telefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={formData.telefono}
              placeholder="Teléfono"
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <button type="submit" className="btn btn-primary mt-3">
        {proveedorToEdit ? 'Actualizar' : 'Agregar'}
      </button>
    </Form>
  );
};

export default ProveedorForm;
