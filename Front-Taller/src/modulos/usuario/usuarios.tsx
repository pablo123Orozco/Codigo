import React, { useState } from 'react';
import UserList from './usuariosList';
import UserForm from './usuariosForms';
import './usuarios.css'; // Aquí importas el archivo CSS personalizado
import axios from 'axios';
import Navbar from '../../componentes/navbar'; // Importamos el componente Navbar
import Sidebar from '../../componentes/Sidebar'; // Importamos el componente Sidebar
import { Button, Modal } from 'react-bootstrap'; // Importamos Button y Modal de React-Bootstrap

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
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Estado para controlar el Sidebar
  const [showModal, setShowModal] = useState<boolean>(false); // Estado para controlar el modal

  // Función para alternar el estado del Sidebar
  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (user: User) => {
    setUserToEdit(user);
    setShowModal(true); // Abrir el modal para editar el usuario
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/usuarios`, { data: { id } });
      alert('Usuario eliminado');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleSave = () => {
    setUserToEdit(null);
    setRefresh(!refresh);
    setShowModal(false); // Cerrar el modal después de guardar
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setUserToEdit(null); // Limpiar el formulario cuando se cierre el modal
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar isSidebarOpen={isSidebarOpen} /> {/* Incluimos el Navbar */}
      <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
        <Sidebar toggleSidebar={toggleSidebar} /> {/* Incluimos el Sidebar */}
        <div className="content">
          <h1>Módulo de Usuarios</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Usuario
          </Button>
          <UserList onEdit={handleEdit} onDelete={handleDelete} />

          {/* Ventana Modal para agregar o editar un usuario */}
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
        </div>
      </div>
    </div>
  );
};

export default UserModule;
