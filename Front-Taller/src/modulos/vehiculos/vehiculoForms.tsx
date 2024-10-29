import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap';

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

    useEffect(() => {
        if (vehiculoToEdit) {
            setFormData(vehiculoToEdit);
        }
    }, [vehiculoToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

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
                    </Form.Group>
                </Col>
            </Row>
            <button type="submit" className="btn btn-submit">
                {vehiculoToEdit ? 'Actualizar' : 'Agregar'}
            </button>
        </Form>
    );
};

export default VehiculoForm;
