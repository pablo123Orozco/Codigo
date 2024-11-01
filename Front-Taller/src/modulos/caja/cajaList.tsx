import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Caja {
  id: number;
  concepto: string;
  monto: number;
  tipo: string;
  fecha: string;
}

interface CajaListProps {
  onEdit: (caja: Caja) => void;
  onDelete: (id: number) => void;
  refresh: boolean;
}

const CajaList: React.FC<CajaListProps> = ({ onEdit, onDelete, refresh }) => {
  const [registros, setRegistros] = useState<Caja[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchRegistros();
  }, [refresh]);

  const fetchRegistros = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/caja');
      setRegistros(response.data.body);
    } catch (error) {
      console.error('Error al obtener registros de caja:', error);
      setError('Error al obtener los registros de caja.');
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(registros.length / itemsPerPage);
  const currentRegistros = registros.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-custom">
      <h2>Lista de Registros de Caja</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="table table-custom">
        <thead>
          <tr>
            <th>ID</th>
            <th>Concepto</th>
            <th>Monto</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentRegistros.length > 0 ? (
            currentRegistros.map((caja) => (
              <tr key={caja.id}>
                <td>{caja.id}</td>
                <td>{caja.concepto}</td>
                <td>{caja.monto}</td>
                <td>{caja.tipo}</td>
                <td>{new Date(caja.fecha).toISOString().split('T')[0]}</td>
                <td className="actions-cell">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="icon-button edit-icon"
                    onClick={() => onEdit(caja)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon-button delete-icon"
                    onClick={() => onDelete(caja.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>No hay registros disponibles</td>
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

export default CajaList;
