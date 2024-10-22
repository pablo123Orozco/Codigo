import React, { useState } from 'react';
import axios from 'axios';
import VehiculoList from './vehiculoList';
import VehiculoForm from './vehiculoForms';
import './vehiculos.css';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import { Button, Modal } from 'react-bootstrap';

interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
    estadoActual: string;
    year: string; // Asegurarse de que 'year' sea consistente
}

const VehiculoModule: React.FC = () => {
    const [vehiculoToEdit, setVehiculoToEdit] = useState<Vehiculo | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);

    // Función para abrir/cerrar el modal
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleEdit = (vehiculo: Vehiculo) => {
        setVehiculoToEdit(vehiculo);
        handleShowModal(); // Abrir el modal al editar
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:4000/api/vehiculos/${id}`);
            alert('Vehículo eliminado');
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error al eliminar vehículo:', error);
        }
    };

    const handleSave = () => {
        setVehiculoToEdit(null);
        setRefresh(!refresh);
        handleCloseModal(); // Cerrar el modal después de guardar
    };

    return (
        <div className="dashboard-wrapper">
            <Navbar isSidebarOpen={isSidebarOpen} />
            <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
                <Sidebar toggleSidebar={setIsSidebarOpen} />
                <div className="content">
                    <h1>Vehículos</h1>
                    <Button variant="primary" onClick={handleShowModal}>
                        Agregar Vehículo
                    </Button>
                    <VehiculoList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />

                    {/* Modal para agregar/editar vehículos */}
                    <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-custom">
                        <Modal.Header closeButton>
                            <Modal.Title>{vehiculoToEdit ? 'Editar Vehículo' : 'Agregar Vehículo'}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <VehiculoForm vehiculoToEdit={vehiculoToEdit} onSave={handleSave} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cerrar
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default VehiculoModule;
