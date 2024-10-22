import React, { useState } from 'react';
import ClienteList from './clientesList';
import ClienteForm from './clientesForms';
import './clientes.css'; 
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap'; 
import Navbar from '../../componentes/navbar'; 
import Sidebar from '../../componentes/Sidebar';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  nit: string;
  telefono: string;
  correo: string;
  estadoCuenta: string;
}

const ClienteModule: React.FC = () => {
  const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); 
  const [showModal, setShowModal] = useState<boolean>(false); 

  
  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleEdit = (cliente: Cliente) => {
    setClienteToEdit(cliente);
    setShowModal(true); 
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/clientes/${id}`);
      alert('Cliente eliminado');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
    }
  };

  const handleSave = () => {
    setClienteToEdit(null);
    setRefresh(!refresh);
    setShowModal(false); 
  };

  
  const handleCloseModal = () => {
    setShowModal(false);
    setClienteToEdit(null); 
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar isSidebarOpen={isSidebarOpen} /> {/* Incluimos el Navbar */}
      <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
        <Sidebar toggleSidebar={toggleSidebar} /> {/* Incluimos el Sidebar */}
        <div className="content">
          <h1>Módulo de Clientes</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Agregar Cliente
          </Button>
          <ClienteList onEdit={handleEdit} onDelete={handleDelete} />

          {/* Ventana Modal para agregar o editar un cliente */}
          <Modal show={showModal} onHide={handleCloseModal} dialogClassName="modal-custom">
            <Modal.Header closeButton>
              <Modal.Title>{clienteToEdit ? 'Editar Cliente' : 'Agregar Cliente'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ClienteForm clienteToEdit={clienteToEdit} onSave={handleSave} />
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

export default ClienteModule;
