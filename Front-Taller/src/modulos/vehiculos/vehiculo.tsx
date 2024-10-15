import React, { useState } from 'react';
import axios from 'axios';  // Agrega esta línea para importar Axios
import VehiculoList from './vehiculoList';
import VehiculoForm from './vehiculoForms';

interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
    estadoActual: string;
    historialReparaciones: string;
}

const VehiculoModule: React.FC = () => {
    const [vehiculoToEdit, setVehiculoToEdit] = useState<Vehiculo | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);

    const handleEdit = (vehiculo: Vehiculo) => {
        setVehiculoToEdit(vehiculo);
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:4000/api/vehiculos/${id}`);
            alert('Vehículo eliminado');
            setRefresh(!refresh);  // Refresca la lista de vehículos
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
        }
    };

    const handleSave = () => {
        setVehiculoToEdit(null);
        setRefresh(!refresh);  // Refresca la lista de vehículos
    };

    return (
        <div>
            <VehiculoForm vehiculoToEdit={vehiculoToEdit} onSave={handleSave} />
            <VehiculoList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />
        </div>
    );
};

export default VehiculoModule;
