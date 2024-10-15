import React, { useState } from 'react';
import OrdenServiceList from './ordenesList';
import OrdenServiceForm from './ordenesForms';
import axios from 'axios';

interface OrdenService {
    id: number;
    detalleReparacion: string;
    costoEstimado: number;
    estado: string;
    idVehiculo: number;
    marca: string;
    modelo: string;
}

const OrdenServiceModule: React.FC = () => {
    const [ordenToEdit, setOrdenToEdit] = useState<OrdenService | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);

    const handleEdit = (orden: OrdenService) => {
        setOrdenToEdit(orden);
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:4000/api/ordenes/${id}`);
            alert('Orden de servicio eliminada');
            setRefresh(!refresh);  // Refresca la lista después de eliminar
        } catch (error) {
            console.error('Error al eliminar la orden de servicio:', error);
        }
    };

    const handleSave = () => {
        setOrdenToEdit(null);
        setRefresh(!refresh);  // Refresca la lista después de guardar
    };

    return (
        <div>
            <OrdenServiceForm ordenToEdit={ordenToEdit} onSave={handleSave} />
            <OrdenServiceList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />
        </div>
    );
};

export default OrdenServiceModule;
