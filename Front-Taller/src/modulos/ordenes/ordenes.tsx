import React, { useState } from 'react';
import OrdenList from './ordenesList';
import OrdenForm from './ordenesForms';
import axios from 'axios';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import { Button, Modal } from 'react-bootstrap';
import { useSpring, animated } from '@react-spring/web';

const OrdenesModule: React.FC = () => {
  const [ordenToEdit, setOrdenToEdit] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
  const [ordenIdToDelete, setOrdenIdToDelete] = useState<number | null>(null);

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (orden: any) => {
    setOrdenToEdit(orden);
    setShowModal(true);
  };

  const requestDelete = (id: number) => {
    setOrdenIdToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (ordenIdToDelete !== null) {
      try {
        await axios.delete(`http://localhost:4000/api/ordenes/${ordenIdToDelete}`);
        setShowConfirmDelete(false);
        setShowDeleteSuccessModal(true);
        setSuccessMessage('Orden eliminada con éxito');
        setRefresh(!refresh);
      } catch (error) {
        console.error('Error al eliminar orden:', error);
      }
    }
  };

  const handleSave = () => {
    setOrdenToEdit(null);
    setRefresh(!refresh);
    setShowModal(false);
    setSuccessMessage(ordenToEdit ? 'Orden actualizada con éxito' : 'Orden agregada con éxito');
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setOrdenToEdit(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseDeleteSuccessModal = () => {
    setShowDeleteSuccessModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setOrdenIdToDelete(null);
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
          <h1>Órdenes de Servicio</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Orden
          </Button>
          <OrdenList onEdit={handleEdit} onDelete={requestDelete} refresh={refresh} />

          <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-custom">
            <Modal.Header closeButton>
              <Modal.Title>{ordenToEdit ? 'Editar Orden' : 'Agregar Orden'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <OrdenForm ordenToEdit={ordenToEdit} onSave={handleSave} setShowSuccessModal={setShowSuccessModal} />
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
                <h5>¿Estás seguro de que deseas eliminar esta orden?</h5>
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
                  <div className="success-animation">✔ Orden eliminada con éxito</div>
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

export default OrdenesModule;
