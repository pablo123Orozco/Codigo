import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import ServicioList from './serviciosList';
import ServicioForm from './serviciosForms'; // Importa el formulario de servicio
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import './servicios.css';

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
  const [servicioToEdit, setServicioToEdit] = useState<Servicio | null>(null);

  const toggleSidebar = (isOpen: boolean): void => {
    setIsSidebarOpen(isOpen);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/servicios/${id}`);
      alert('Servicio eliminado');
      setRefresh(!refresh); // Refrescar la lista de servicios
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    }
  };

  const handleEdit = (servicio: Servicio) => {
    setServicioToEdit(servicio);
    setShowModal(true); // Abrir modal para editar
  };

  const handleSave = () => {
    setServicioToEdit(null);
    setShowModal(false); // Cerrar el modal después de guardar
    setRefresh(!refresh); // Refrescar la lista después de la edición
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setServicioToEdit(null); // Limpiar el formulario al cerrar el modal
  };

  const goToAgregarServicio = () => {
    setServicioToEdit(null);
    setShowModal(true); // Abrir el modal para agregar un nuevo servicio
  };

  return (
    <div className="dashboard-wrapper">
      <Navbar isSidebarOpen={isSidebarOpen} />
      <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
        <Sidebar toggleSidebar={toggleSidebar} />
        <div className="content">
          <h1>Módulo de Servicios</h1>
          <Button variant="primary" onClick={goToAgregarServicio}>
            Agregar Servicio
          </Button>
          <ServicioList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />

          {/* Modal para agregar/editar servicios */}
          <Modal show={showModal} onHide={handleCloseModal}>
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
        </div>
      </div>
    </div>
  );
};

export default ServicioModule;
