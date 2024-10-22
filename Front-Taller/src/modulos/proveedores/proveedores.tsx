import React, { useState } from 'react';
import ProveedorList from './proveedoresList';
import ProveedorForm from './proveedoresForms';
import './proveedor.css'
import axios from 'axios';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import { Button, Modal } from 'react-bootstrap';

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

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setProveedorToEdit(proveedor);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/proveedor/${id}`);
      alert('Proveedor eliminado');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
    }
  };

  const handleSave = () => {
    setProveedorToEdit(null);
    setRefresh(!refresh);
    setShowModal(false);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setProveedorToEdit(null);
  };

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
          <ProveedorList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />

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
        </div>
      </div>
    </div>
  );
};

export default ProveedorModule;
