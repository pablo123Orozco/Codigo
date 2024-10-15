import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface OrdenService {
    id?: number;
    detalleReparacion: string;
    costoEstimado: number;
    estado: string;
    idVehiculo: number;
}

interface OrdenServiceFormProps {
    ordenToEdit: OrdenService | null;
    onSave: () => void;
}

const OrdenServiceForm: React.FC<OrdenServiceFormProps> = ({ ordenToEdit, onSave }) => {
    const [formData, setFormData] = useState<OrdenService>({
        detalleReparacion: '',
        costoEstimado: 0,
        estado: '',
        idVehiculo: 0,
    });

    useEffect(() => {
        if (ordenToEdit) {
            setFormData(ordenToEdit);
        }
    }, [ordenToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (ordenToEdit) {
                // Actualizar orden existente
                await axios.put(`http://localhost:4000/api/ordenes/${ordenToEdit.id}`, formData);
                alert('Orden de servicio actualizada');
            } else {
                // Crear nueva orden de servicio
                await axios.post('http://localhost:4000/api/ordenes', formData);
                alert('Orden de servicio creada');
            }
            onSave();
        } catch (error) {
            console.error('Error al guardar la orden de servicio:', error);
        }
    };

    return (
        <div>
            <h2>{ordenToEdit ? 'Editar Orden de Servicio' : 'Agregar Orden de Servicio'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="detalleReparacion"
                    placeholder="Detalle de Reparación"
                    value={formData.detalleReparacion}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="costoEstimado"
                    placeholder="Costo Estimado"
                    value={formData.costoEstimado}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="estado"
                    placeholder="Estado"
                    value={formData.estado}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="idVehiculo"
                    placeholder="ID del Vehículo"
                    value={formData.idVehiculo}
                    onChange={handleChange}
                />
                <button type="submit">{ordenToEdit ? 'Actualizar' : 'Agregar'}</button>
            </form>
        </div>
    );
};

export default OrdenServiceForm;
