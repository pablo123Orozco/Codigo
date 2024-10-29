import React, { useState } from 'react';
import ProveedorList from './proveedoresList';
import ProveedorForm from './proveedoresForms';
import './proveedor.css';
import axios from 'axios';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import { Button, Modal } from 'react-bootstrap';
import { useSpring, animated } from '@react-spring/web';

interface Proveedor {
  id: number;
  nombre: string;
  nit: string;
  dpi: string;
  razonSocial: string;
  telefono: string;
}

const ProveedorModule: React.FC = () => {
  const [proveedorToEdit, setProveedorToEdit] = useState<Proveedor | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
  const [proveedorIdToDelete, setProveedorIdToDelete] = useState<number | null>(null);

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setProveedorToEdit(proveedor);
    setShowModal(true);
  };

  const requestDelete = (id: number) => {
    setProveedorIdToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (proveedorIdToDelete !== null) {
      try {
        await axios.delete(`http://localhost:4000/api/proveedor/${proveedorIdToDelete}`);
        setShowConfirmDelete(false);
        setShowDeleteSuccessModal(true);
        setSuccessMessage('Proveedor eliminado con éxito');
        setRefresh(!refresh);
      } catch (error) {
        console.error('Error al eliminar proveedor:', error);
      }
    }
  };

  const handleSave = () => {
    setProveedorToEdit(null);
    setRefresh(!refresh);
    setShowModal(false);
    setSuccessMessage(proveedorToEdit ? 'Proveedor actualizado correctamente' : 'Proveedor agregado correctamente');
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProveedorToEdit(null);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleCloseDeleteSuccessModal = () => {
    setShowDeleteSuccessModal(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
    setProveedorIdToDelete(null);
  };

  // Animación para el modal de éxito de guardar y actualizar
  const successModalAnimation = useSpring({
    opacity: showSuccessModal ? 1 : 0,
    transform: showSuccessModal ? 'scale(1)' : 'scale(0.9)',
    config: { duration: 300 },
  });

  // Animación para el modal de éxito de eliminación
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
          <h1>Módulo de Proveedores</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Proveedor
          </Button>
          <ProveedorList onEdit={handleEdit} onDelete={requestDelete} refresh={refresh} />

          {/* Modal para agregar o editar un proveedor */}
          <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-custom">
            <Modal.Header closeButton>
              <Modal.Title>{proveedorToEdit ? 'Editar Proveedor' : 'Agregar Proveedor'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ProveedorForm proveedorToEdit={proveedorToEdit} onSave={handleSave} />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal de éxito para operaciones de guardado y actualización */}
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

          {/* Modal de confirmación de eliminación */}
          {showConfirmDelete && (
            <Modal show={showConfirmDelete} onHide={handleCancelDelete} centered>
              <Modal.Body className="text-center">
                <h5>¿Estás seguro de que deseas eliminar este proveedor?</h5>
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

          {/* Modal de éxito después de eliminar */}
          {showDeleteSuccessModal && (
            <animated.div style={deleteSuccessModalAnimation} className="success-modal">
              <Modal.Dialog centered>
                <Modal.Body className="text-center">
                  <div className="success-animation">✔ Proveedor eliminado con éxito</div>
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

export default ProveedorModule;
