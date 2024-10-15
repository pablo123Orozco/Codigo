import React, { useState } from 'react';
import CompraList from './comprasList';
import CompraForm from './comprasForms';
import axios from 'axios';

const CompraModule: React.FC = () => {
  const [compraToEdit, setCompraToEdit] = useState(null);
  const [refresh, setRefresh] = useState(false);

  const handleEdit = (compra: any) => {
    setCompraToEdit(compra);
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
  };

  return (
    <div>
      <CompraForm compraToEdit={compraToEdit} onSave={handleSave} />
      <CompraList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />
    </div>
  );
};

export default CompraModule;
