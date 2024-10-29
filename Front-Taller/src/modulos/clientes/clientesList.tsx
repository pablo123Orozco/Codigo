import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  nit: string;
  telefono: string;
  correo: string;
  estadoCuenta: string;
}

interface ClienteListProps {
  onEdit: (cliente: Cliente) => void;
  onDelete: (id: number) => void;
  refresh: boolean;
}

const ClienteList: React.FC<ClienteListProps> = ({ onEdit, onDelete, refresh }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClientes();
  }, [refresh]);

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/clientes');
      if (Array.isArray(response.data.body)) {
        setClientes(response.data.body);
      } else {
        setError('La estructura de la respuesta no es válida.');
      }
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      setError('Error al obtener los clientes.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando clientes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-custom">
      <h2>Lista de Clientes</h2>
      <table className="table table-custom">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>NIT</th>
            <th>Teléfono</th>
            <th>Correo</th>
            <th>Estado de Cuenta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map(cliente => (
              <tr key={cliente.id}>
                <td>{cliente.id}</td>
                <td>{cliente.nombre}</td>
                <td>{cliente.apellido}</td>
                <td>{cliente.nit}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.estadoCuenta}</td>
                <td className="actions-cell">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="icon-button edit-icon"
                    onClick={() => onEdit(cliente)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon-button delete-icon"
                    onClick={() => onDelete(cliente.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No hay clientes disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClienteList;
