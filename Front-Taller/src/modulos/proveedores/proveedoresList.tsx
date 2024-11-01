import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Proveedor {
  id: number;
  nombre: string;
  nit: string;
  dpi: string;
  razonSocial: string;
  telefono: string;
}

interface ProveedorListProps {
  onEdit: (proveedor: Proveedor) => void;
  onDelete: (id: number) => void;
  refresh: boolean;
}

const ProveedorList: React.FC<ProveedorListProps> = ({ onEdit, onDelete, refresh }) => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchProveedores();
  }, [refresh]);

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/proveedor');
      if (Array.isArray(response.data.body)) {
        setProveedores(response.data.body);
      } else {
        setError('La estructura de la respuesta no es válida.');
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      setError('Error al obtener los proveedores.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(proveedores.length / itemsPerPage);
  const currentProveedores = proveedores.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div>Cargando proveedores...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-custom">
      <h2>Lista de Proveedores</h2>
      <table className="table table-custom">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>NIT</th>
            <th>DPI</th>
            <th>Razón Social</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentProveedores.length > 0 ? (
            currentProveedores.map(proveedor => (
              <tr key={proveedor.id}>
                <td>{proveedor.id}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.nit}</td>
                <td>{proveedor.dpi}</td>
                <td>{proveedor.razonSocial}</td>
                <td>{proveedor.telefono}</td>
                <td className="actions-cell">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="icon-button edit-icon"
                    onClick={() => onEdit(proveedor)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon-button delete-icon"
                    onClick={() => onDelete(proveedor.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No hay proveedores disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProveedorList;
