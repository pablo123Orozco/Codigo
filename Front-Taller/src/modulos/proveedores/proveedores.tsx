import React, { useState } from 'react';
import ProveedorList from './proveedoresList';
import ProveedorForm from './proveedoresForms';
import axios from 'axios';

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

  const handleEdit = (proveedor: Proveedor) => {
    setProveedorToEdit(proveedor);
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
  };

  return (
    <div>
      <ProveedorForm proveedorToEdit={proveedorToEdit} onSave={handleSave} />
      <ProveedorList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />
    </div>
  );
};

export default ProveedorModule;
