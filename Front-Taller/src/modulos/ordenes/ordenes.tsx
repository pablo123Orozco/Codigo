import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import OrdenServiceList from './ordenesList';
import axios from 'axios';
import Navbar from '../../componentes/navbar'; 
import Sidebar from '../../componentes/Sidebar'; 
import './orden.css';
import { Button } from 'react-bootstrap'; 

interface OrdenService {
    id: number;
    detalleReparacion: string;
    costoEstimado: number;
    estado: string;
    idVehiculo: number;
    marca: string;
    modelo: string;
    numeroOrden: number;
    placa: string;
    nombreCliente: string;
    estadoPago: string;
}

const OrdenesServicioModule: React.FC = () => {
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const toggleSidebar = (isOpen: boolean): void => {
        setIsSidebarOpen(isOpen);
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:4000/api/ordenes/${id}`);
            alert('Orden de servicio eliminada');
            setRefresh(!refresh); 
        } catch (error) {
            console.error('Error al eliminar la orden de servicio:', error);
        }
    };

    const handleEdit = (orden: OrdenService) => {
        // Pasamos los datos de la orden a editar como estado
        navigate('/ordenes/nueva', { state: { ordenToEdit: orden } });
    };

    const goToAgregarOrden = () => {
        navigate('/ordenes/nueva');
    };

    return (
        <div className="dashboard-wrapper">
            <Navbar isSidebarOpen={isSidebarOpen} />
            <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
                <Sidebar toggleSidebar={toggleSidebar} />
                <div className="content">
                    <h1>Módulo de Órdenes de Servicio</h1>
                    <Button variant="primary" onClick={goToAgregarOrden}>
                        Agregar Orden de Servicio
                    </Button>
                    {/* Aquí pasamos correctamente las props */}
                    <OrdenServiceList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />
                </div>
            </div>
        </div>
    );
};

export default OrdenesServicioModule;
