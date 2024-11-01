import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Mecanico {
  id: number;
  nombre: string;
  fecha: string;
}

interface MecanicoListProps {
  onEdit: (mecanico: Mecanico) => void;
  onDelete: (id: number) => void;
  refresh: boolean;
}

const MecanicoList: React.FC<MecanicoListProps> = ({ onEdit, onDelete, refresh }) => {
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchMecanicos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/mecanico');
        const mecanicosData = response.data.body;

        if (Array.isArray(mecanicosData)) {
          setMecanicos(mecanicosData);
          setError(null);
        } else {
          throw new Error('La respuesta no es un array válido');
        }
      } catch (err) {
        console.error('Error al obtener los mecánicos:', err);
        setError('Error al obtener los datos de mecánicos.');
      }
    };

    fetchMecanicos();
  }, [refresh]);

  const formatFecha = (fecha: string) => fecha.split('T')[0];

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(mecanicos.length / itemsPerPage);
  const currentMecanicos = mecanicos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-custom">
      <h2>Lista de Mecánicos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="table table-custom">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentMecanicos.length > 0 ? (
            currentMecanicos.map((mecanico) => (
              <tr key={`${mecanico.id}-${mecanico.nombre}`}>
                <td>{mecanico.id}</td>
                <td>{mecanico.nombre}</td>
                <td>{formatFecha(mecanico.fecha)}</td>
                <td className="actions-cell">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="icon-button edit-icon"
                    onClick={() => onEdit(mecanico)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon-button delete-icon"
                    onClick={() => onDelete(mecanico.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No hay mecánicos disponibles</td>
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
            style={{
              color: currentPage === index + 1 ? 'blue' : 'red',
              fontWeight: currentPage === index + 1 ? 'bold' : 'normal',
              border: '1px solid #ccc',
              borderRadius: '5px',
              margin: '0 5px',
              padding: '5px 10px',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MecanicoList;
