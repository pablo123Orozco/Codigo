import React, { useState } from 'react';
import MecanicoList from './mecanicoList';
import MecanicoForm from './mecanicoForm';
import axios from 'axios';
import '../../componentes/diseño.css'
import Navbar from '../../componentes/navbar'; // Importamos el componente Navbar
import Sidebar from '../../componentes/Sidebar'; // Importamos el componente Sidebar
import { Button, Modal } from 'react-bootstrap'; // Importamos los componentes de Bootstrap

interface Mecanico {
  mecanicoId: number;
  nombre: string;
  fecha: string;
}

const MecanicoModule: React.FC = () => {
  const [mecanicoToEdit, setMecanicoToEdit] = useState<Mecanico | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (mecanico: Mecanico) => {
    setMecanicoToEdit(mecanico);
    setShowModal(true);
  };

  const handleDelete = async (mecanicoId: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/mecanico/${mecanicoId}`);
      alert('Mecánico eliminado');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error al eliminar mecánico:', error);
    }
  };

  const handleSave = () => {
    setMecanicoToEdit(null);
    setRefresh(!refresh);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMecanicoToEdit(null);
  };

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
          <MecanicoList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />

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
        </div>
      </div>
    </div>
  );
};

export default MecanicoModule;
