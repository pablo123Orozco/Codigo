import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import ServicioList from './serviciosList';
import ServicioForm from './serviciosForms';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import './servicios.css';
import { useSpring, animated } from '@react-spring/web';

interface Servicio {
  id: number;
  servicio: string;
  costo_mano_obra: number;
  precio_repuesto: number;
  precio_total: number;
  descripcion: string;
  orden_servicio_id: number;
}

const ServicioModule: React.FC = () => {
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [servicioToEdit, setServicioToEdit] = useState<Servicio | null>(null);
  const [servicioIdToDelete, setServicioIdToDelete] = useState<number | null>(null);

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleDeleteRequest = (id: number) => {
    setServicioIdToDelete(id);
    setShowConfirmDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (servicioIdToDelete !== null) {
      try {
        await axios.delete(`http://localhost:4000/api/servicios/${servicioIdToDelete}`);
        setShowConfirmDelete(false);
        setShowDeleteSuccessModal(true);
        setSuccessMessage('Servicio eliminado con éxito');
        setRefresh(!refresh);
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
        setErrorMessage('Error al eliminar el servicio. Por favor, intenta de nuevo.');
        setShowErrorModal(true);
      }
    }
  };

  const handleEdit = (servicio: Servicio) => {
    setServicioToEdit(servicio);
    setShowModal(true);
  };

  const handleSave = () => {
    setServicioToEdit(null);
    setRefresh(!refresh);
    setShowModal(false);
    setSuccessMessage(servicioToEdit ? 'Servicio actualizado correctamente' : 'Servicio agregado correctamente');
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setServicioToEdit(null);
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

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setServicioIdToDelete(null);
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
          <h1>Módulo de Servicios</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Servicio
          </Button>
          <ServicioList onEdit={handleEdit} onDelete={handleDeleteRequest} refresh={refresh} />

          {/* Modal para agregar/editar servicios */}
          <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-custom">
            <Modal.Header closeButton>
              <Modal.Title>{servicioToEdit ? 'Editar Servicio' : 'Agregar Servicio'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ServicioForm servicioToEdit={servicioToEdit} onSave={handleSave} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal de confirmación de eliminación */}
          {showConfirmDelete && (
            <Modal show={showConfirmDelete} onHide={handleCancelDelete} centered>
              <Modal.Body className="text-center">
                <h5>¿Estás seguro de que deseas eliminar este servicio?</h5>
                <div className="d-flex justify-content-center mt-4">
                  <Button variant="danger" onClick={handleConfirmDelete} className="me-2">
                    Sí
                  </Button>
                  <Button variant="secondary" onClick={handleCancelDelete}>
                    No
                  </Button>
                </div>
              </Modal.Body>
            </Modal>
          )}

          {/* Modal de éxito de creación/actualización */}
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

          {/* Modal de éxito de eliminación */}
          {showDeleteSuccessModal && (
            <animated.div style={deleteSuccessModalAnimation} className="success-modal">
              <Modal.Dialog centered>
                <Modal.Body className="text-center">
                  <div className="success-animation">✔ Servicio eliminado con éxito</div>
                  <Button variant="success" onClick={handleCloseDeleteSuccessModal}>
                    Cerrar
                  </Button>
                </Modal.Body>
              </Modal.Dialog>
            </animated.div>
          )}

          {/* Modal de error al eliminar */}
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

export default ServicioModule;
