import React, { useState } from 'react';
import ClienteList from './clientesList';
import ClienteForm from './clientesForms';
import './clientes.css';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';
import { useSpring, animated } from '@react-spring/web';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  nit: string;
  telefono: string;
  correo: string;
  estadoCuenta: string;
}

const ClienteModule: React.FC = () => {
  const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
  const [clienteIdToDelete, setClienteIdToDelete] = useState<number | null>(null);

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (cliente: Cliente) => {
    setClienteToEdit(cliente);
    setShowModal(true);
  };

  const requestDelete = (id: number) => {
    setClienteIdToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (clienteIdToDelete !== null) {
      try {
        await axios.delete(`http://localhost:4000/api/clientes/${clienteIdToDelete}`);
        setShowConfirmDelete(false);
        setShowDeleteSuccessModal(true);
        setRefresh(!refresh);
      } catch (error) {
        console.error('Error al eliminar cliente:', error);
      }
    }
  };

  const handleSave = () => {
    setClienteToEdit(null);
    setRefresh(!refresh);
    setShowModal(false);
    setSuccessMessage(clienteToEdit ? 'Cliente actualizado correctamente' : 'Cliente agregado correctamente');
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setClienteToEdit(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseDeleteSuccessModal = () => {
    setShowDeleteSuccessModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setClienteIdToDelete(null);
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
          <h1>Módulo de Clientes</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Cliente
          </Button>
          <ClienteList onEdit={handleEdit} onDelete={requestDelete} refresh={refresh} />

          <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-custom">
            <Modal.Header closeButton>
              <Modal.Title>{clienteToEdit ? 'Editar Cliente' : 'Agregar Cliente'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ClienteForm clienteToEdit={clienteToEdit} onSave={handleSave} />
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

          {showConfirmDelete && (
            <Modal show={showConfirmDelete} onHide={handleCancelDelete} centered>
              <Modal.Body className="text-center">
                <h5>¿Estás seguro de que deseas eliminar este cliente?</h5>
                <div className="d-flex justify-content-center mt-4 delete-buttons">
                  <Button variant="danger" onClick={confirmDelete} className="me-2">
                    Sí
                  </Button>
                  <Button variant="secondary" onClick={handleCancelDelete}>
                    No
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          )}

          {showDeleteSuccessModal && (
            <animated.div style={deleteSuccessModalAnimation} className="success-modal">
              <Modal.Dialog centered>
                <Modal.Body className="text-center">
                  <div className="success-animation">✔ Cliente eliminado con éxito</div>
                  <Button variant="success" onClick={handleCloseDeleteSuccessModal}>
                    Cerrar
                  </Button>
                </Modal.Body>
              </Modal.Dialog>
            </animated.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClienteModule;
