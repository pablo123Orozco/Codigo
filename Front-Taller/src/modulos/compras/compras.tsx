import React, { useState } from 'react';
import CompraList from './comprasList';
import CompraForm from './comprasForms';
import axios from 'axios';
import Navbar from '../../componentes/navbar'; // Importamos el componente Navbar
import Sidebar from '../../componentes/Sidebar'; // Importamos el componente Sidebar
import { Button, Modal } from 'react-bootstrap'; // Usamos React-Bootstrap para diseño

const CompraModule: React.FC = () => {
  const [compraToEdit, setCompraToEdit] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (compra: any) => {
    setCompraToEdit(compra);
    setShowModal(true); // Abrir modal
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/compras/${id}`);
      alert('Compra eliminada');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error al eliminar compra:', error);
    }
  };

  const handleSave = () => {
    setCompraToEdit(null);
    setRefresh(!refresh);
    setShowModal(false); // Cerrar modal
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCompraToEdit(null); // Limpiar el formulario cuando se cierre el modal
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar isSidebarOpen={isSidebarOpen} />
      <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
        <Sidebar toggleSidebar={toggleSidebar} />
        <div className="content">
          <h1>Módulo de Compras</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Compra
          </Button>
          <CompraList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />

          <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-custom">
            <Modal.Header closeButton>
              <Modal.Title>{compraToEdit ? 'Editar Compra' : 'Agregar Compra'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CompraForm compraToEdit={compraToEdit} onSave={handleSave} />
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

export default CompraModule;
