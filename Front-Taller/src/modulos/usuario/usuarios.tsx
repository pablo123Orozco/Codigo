import React, { useState } from 'react';
import UserList from './usuariosList';
import UserForm from './usuariosForms';
import './usuarios.css';
import axios from 'axios';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import { Button, Modal } from 'react-bootstrap';
import { useSpring, animated } from '@react-spring/web';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  estado: boolean;
  rol: string;
}

const UserModule: React.FC = () => {
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setShowModal(true);
  };

  const requestDelete = (id: number) => {
    setUserIdToDelete(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (userIdToDelete !== null) {
      try {
        await axios.delete(`http://localhost:4000/api/usuarios`, { data: { id: userIdToDelete } });
        setShowConfirmDelete(false);
        setShowDeleteSuccessModal(true);
        setRefresh(!refresh);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setErrorMessage('Error al eliminar el usuario. Por favor, intenta de nuevo.');
        setShowErrorModal(true);
      }
    }
  };

  const handleSave = () => {
    setUserToEdit(null);
    setRefresh(!refresh);
    setShowModal(false);
    setSuccessMessage(userToEdit ? 'Usuario actualizado correctamente' : 'Usuario agregado correctamente');
    setShowSuccessModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setUserToEdit(null);
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
    setUserIdToDelete(null);
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
          <h1>Módulo de Usuarios</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Usuario
          </Button>
          <UserList onEdit={handleEdit} onDelete={requestDelete} refresh={refresh} />

          <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-custom">
            <Modal.Header closeButton>
              <Modal.Title>{userToEdit ? 'Editar Usuario' : 'Agregar Usuario'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <UserForm userToEdit={userToEdit} onSave={handleSave} />
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
                <h5>¿Estás seguro de que deseas eliminar este usuario?</h5>
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
                  <div className="success-animation">✔ Usuario eliminado con éxito</div>
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

export default UserModule;
