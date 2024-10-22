import React, { useState } from 'react';
import CajaList from './cajaList';
import CajaForm from './cajaForms';
import axios from 'axios';
import Navbar from '../../componentes/navbar'; 
import Sidebar from '../../componentes/Sidebar'; 
import { Button, Modal } from 'react-bootstrap';

const CajaModule: React.FC = () => {
  const [cajaToEdit, setCajaToEdit] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (caja: any) => {
    setCajaToEdit(caja);
    setShowModal(true); // Abrir modal
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/caja/${id}`);
      alert('Registro de caja eliminado');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error al eliminar registro de caja:', error);
    }
  };

  const handleSave = () => {
    setCajaToEdit(null);
    setRefresh(!refresh);
    setShowModal(false); // Cerrar modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCajaToEdit(null); // Limpiar el formulario cuando se cierre el modal
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar isSidebarOpen={isSidebarOpen} />
      <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
        <Sidebar toggleSidebar={toggleSidebar} />
        <div className="content">
          <h1>Módulo de Caja</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Registro
          </Button>
          <CajaList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />

          <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-custom">
            <Modal.Header closeButton>
              <Modal.Title>{cajaToEdit ? 'Editar Registro' : 'Agregar Registro'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CajaForm cajaToEdit={cajaToEdit} onSave={handleSave} />
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

export default CajaModule;
