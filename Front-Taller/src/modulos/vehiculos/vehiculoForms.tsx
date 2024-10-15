import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Vehiculo {
    id?: number;
    marca: string;
    modelo: string;
    placa: string;
    estadoActual: string;
    historialReparaciones: string;
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
        historialReparaciones: '',
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

        if (vehiculoToEdit) {
            // Actualizar vehículo
            try {
                await axios.put(`http://localhost:4000/api/vehiculos/${vehiculoToEdit.id}`, formData);
                alert('Vehículo actualizado');
                onSave();
            } catch (error) {
                console.error('Error al actualizar vehículo:', error);
            }
        } else {
            // Crear nuevo vehículo
            try {
                await axios.post('http://localhost:4000/api/vehiculos', formData);
                alert('Vehículo creado');
                onSave();
            } catch (error) {
                console.error('Error al crear vehículo:', error);
            }
        }
    };

    return (
        <div>
            <h2>{vehiculoToEdit ? 'Editar Vehículo' : 'Agregar Vehículo'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="marca"
                    placeholder="Marca"
                    value={formData.marca}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="modelo"
                    placeholder="Modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="placa"
                    placeholder="Placa"
                    value={formData.placa}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="estadoActual"
                    placeholder="Estado Actual"
                    value={formData.estadoActual}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="historialReparaciones"
                    placeholder="Historial de Reparaciones"
                    value={formData.historialReparaciones}
                    onChange={handleChange}
                />
                <button type="submit">{vehiculoToEdit ? 'Actualizar' : 'Agregar'}</button>
            </form>
        </div>
    );
};

export default VehiculoForm;
