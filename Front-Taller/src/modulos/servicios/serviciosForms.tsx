import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Col, Row } from 'react-bootstrap';

interface Servicio {
  id?: number;
  servicio: string;
  costo_mano_obra: number;
  precio_repuesto: number;
  precio_total: number;
  descripcion: string;
  orden_servicio_id: number;
}

interface OrdenServicio {
  id: number;
  numeroOrden: number; // o el campo que identifique la orden de servicio
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
    precio_total: 0,  // Se calculará automáticamente
    descripcion: '',
    orden_servicio_id: 0,
  });

  const [ordenesServicio, setOrdenesServicio] = useState<OrdenServicio[]>([]); // Estado para las órdenes de servicio

  // Cargar los datos si estamos editando
  useEffect(() => {
    if (servicioToEdit) {
      setFormData(servicioToEdit);
    }
  }, [servicioToEdit]);

  // Cargar las órdenes de servicio desde la base de datos
  useEffect(() => {
    const fetchOrdenesServicio = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/ordenes'); // Ajusta la URL según tu API
        setOrdenesServicio(response.data.body); // Ajusta 'body' según el formato de respuesta de tu API
      } catch (error) {
        console.error('Error al obtener las órdenes de servicio:', error);
      }
    };

    fetchOrdenesServicio();
  }, []);

  // Actualizamos el costo total automáticamente cada vez que cambien los valores de costo_mano_obra o precio_repuesto
  useEffect(() => {
    const precioTotalCalculado = formData.costo_mano_obra + formData.precio_repuesto;
    setFormData((prevData) => ({ ...prevData, precio_total: precioTotalCalculado }));
  }, [formData.costo_mano_obra, formData.precio_repuesto]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number' || name.includes('precio') || name === 'costo_mano_obra' || name === 'orden_servicio_id') {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (servicioToEdit) {
        // Actualizar servicio existente
        await axios.put(`http://localhost:4000/api/servicios/${servicioToEdit.id}`, formData);
        alert('Servicio actualizado');
      } else {
        // Crear nuevo servicio
        await axios.post('http://localhost:4000/api/servicios', formData);
        alert('Servicio creado');
      }
      onSave();
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
              required
            />
            <Form.Text className="text-muted">
              Ejemplo: Mantenimiento General, Cambio de Filtro, etc.
            </Form.Text>
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
              value={formData.costo_mano_obra}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="precio_repuesto">
            <Form.Label>Precio de Repuestos</Form.Label>
            <Form.Control
              type="number"
              name="precio_repuesto"
              placeholder="Ingrese el precio de los repuestos"
              value={formData.precio_repuesto}
              onChange={handleChange}
              required
            />
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
              value={formData.precio_total}
              readOnly // Campo no editable
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
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col>
          <Form.Group controlId="orden_servicio_id">
            <Form.Label>Orden de Servicio</Form.Label>
            <Form.Control
              as="select"
              name="orden_servicio_id"
              value={formData.orden_servicio_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar Orden de Servicio</option>
              {ordenesServicio.map((orden) => (
                <option key={orden.id} value={orden.id}>
                  {orden.numeroOrden} {/* Puedes mostrar más datos aquí si lo deseas */}
                </option>
              ))}
            </Form.Control>
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
