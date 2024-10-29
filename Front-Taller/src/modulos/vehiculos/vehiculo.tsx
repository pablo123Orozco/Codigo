import React, { useState } from 'react';
import axios from 'axios';
import VehiculoList from './vehiculoList';
import VehiculoForm from './vehiculoForms';
import './vehiculos.css';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import { Button, Modal } from 'react-bootstrap';
import { useSpring, animated } from '@react-spring/web';

interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
    estadoActual: string;
    year: string;
}

const VehiculoModule: React.FC = () => {
    const [vehiculoToEdit, setVehiculoToEdit] = useState<Vehiculo | null>(null);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
    const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');

    const toggleSidebar = (isOpen: boolean): void => {
        setIsSidebarOpen(isOpen);
    };

    const handleEdit = (vehiculo: Vehiculo) => {
        setVehiculoToEdit(vehiculo);
        setShowModal(true);
    };

    const handleSave = () => {
        setVehiculoToEdit(null);
        setRefresh(!refresh);
        setShowModal(false);
        setSuccessMessage(vehiculoToEdit ? 'Vehículo actualizado correctamente' : 'Vehículo agregado correctamente');
        setShowSuccessModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setVehiculoToEdit(null);
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
    };

    const handleCloseDeleteSuccessModal = () => {
        setShowDeleteSuccessModal(false);
    };

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const successModalAnimation = useSpring({
        opacity: showSuccessModal ? 1 : 0,
        transform: showSuccessModal ? 'scale(1)' : 'scale(0.9)',
        config: { duration: 300 },
    });

    const deleteSuccessModalAnimation = useSpring({
        opacity: showDeleteSuccessModal ? 1 : 0,
        transform: showDeleteSuccessModal ? 'scale(1)' : 'scale(0.9)',
        config: { duration: 300 },
    });

    return (
        <div className="dashboard-wrapper">
            <Navbar isSidebarOpen={isSidebarOpen} />
            <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
                <Sidebar toggleSidebar={toggleSidebar} />
                <div className="content">
                    <h1>Vehículos</h1>
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Agregar Vehículo
                    </Button>
                    <VehiculoList onEdit={handleEdit} refresh={refresh} />

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

                    {showSuccessModal && (
                        <animated.div style={successModalAnimation} className="success-modal">
                            <Modal.Dialog centered>
                                <Modal.Body className="text-center">
                                    <div className="success-animation">✔ {successMessage}</div>
                                    <Button variant="success" onClick={handleCloseSuccessModal}>
                                        Cerrar
                                    </Button>
                                </Modal.Body>
                            </Modal.Dialog>
                        </animated.div>
                    )}

                    {showDeleteSuccessModal && (
                        <animated.div style={deleteSuccessModalAnimation} className="success-modal">
                            <Modal.Dialog centered>
                                <Modal.Body className="text-center">
                                    <div className="success-animation">✔ Vehículo eliminado con éxito</div>
                                    <Button variant="success" onClick={handleCloseDeleteSuccessModal}>
                                        Cerrar
                                    </Button>
                                </Modal.Body>
                            </Modal.Dialog>
                        </animated.div>
                    )}

                    {showErrorModal && (
                        <Modal show={showErrorModal} onHide={handleCloseErrorModal} centered>
                            <Modal.Body className="text-center">
                                <div className="error-animation">⚠ {errorMessage}</div>
                                <Button variant="danger" onClick={handleCloseErrorModal} className="mt-3">
                                    Cerrar
                                </Button>
                            </Modal.Body>
                        </Modal>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VehiculoModule;
