import React, { useState } from 'react';
import ClienteList from './clientesList';
import ClienteForm from './clientesForms';
import './clientes.css'; 
import axios from 'axios';

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

  const handleEdit = (cliente: Cliente) => {
    setClienteToEdit(cliente);
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
  };

  return (
    <div>
      <ClienteForm clienteToEdit={clienteToEdit} onSave={handleSave} />
      <ClienteList onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default ClienteModule;
