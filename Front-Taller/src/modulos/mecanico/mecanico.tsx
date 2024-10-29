import React, { useState } from 'react';
import MecanicoList from './mecanicoList';
import MecanicoForm from './mecanicoForm';
import axios from 'axios';
import '../../componentes/diseño.css';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import { Button, Modal } from 'react-bootstrap';
import { useSpring, animated } from '@react-spring/web';

interface Mecanico {
  id: number;
  nombre: string;
  fecha: string;
}

const MecanicoModule: React.FC = () => {
  const [mecanicoToEdit, setMecanicoToEdit] = useState<Mecanico | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
  const [mecanicoIdToDelete, setMecanicoIdToDelete] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string>('');

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (mecanico: Mecanico) => {
    setMecanicoToEdit(mecanico);
    setShowModal(true);
  };

  const requestDelete = (id: number) => {
    setMecanicoIdToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (mecanicoIdToDelete !== null) {
      try {
        await axios.delete(`http://localhost:4000/api/mecanico/${mecanicoIdToDelete}`);
        setShowConfirmDelete(false);
        setShowDeleteSuccessModal(true);
        setSuccessMessage('Mecánico eliminado con éxito');
        setRefresh(!refresh);
      } catch (error) {
        console.error('Error al eliminar el mecánico:', error);
      }
    }
  };

  const handleSave = () => {
    setMecanicoToEdit(null);
    setRefresh(!refresh);
    setShowModal(false);
    setSuccessMessage(mecanicoToEdit ? 'Mecánico actualizado correctamente' : 'Mecánico agregado correctamente');
    setShowDeleteSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMecanicoToEdit(null);
  };

  const handleCloseDeleteSuccessModal = () => {
    setShowDeleteSuccessModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setMecanicoIdToDelete(null);
  };

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
          <h1>Módulo de Mecánicos</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Mecánico
          </Button>
          <MecanicoList onEdit={handleEdit} onDelete={requestDelete} refresh={refresh} />

          <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-custom">
            <Modal.Header closeButton>
              <Modal.Title>{mecanicoToEdit ? 'Editar Mecánico' : 'Agregar Mecánico'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <MecanicoForm mecanicoToEdit={mecanicoToEdit} onSave={handleSave} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

          {showConfirmDelete && (
            <Modal show={showConfirmDelete} onHide={handleCancelDelete} centered>
              <Modal.Body className="text-center">
                <h5>¿Estás seguro de que deseas eliminar este mecánico?</h5>
                <div className="d-flex justify-content-center mt-4">
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
                  <div className="success-animation">✔ {successMessage}</div>
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

export default MecanicoModule;
