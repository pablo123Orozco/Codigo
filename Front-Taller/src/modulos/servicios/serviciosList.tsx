import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Servicio {
  id: number;
  servicio: string;
  costo_mano_obra: number;
  precio_repuesto: number;
  precio_total: number;
  descripcion: string;
}

interface ServicioListProps {
  onEdit: (servicio: Servicio) => void;
  onDelete: (id: number) => void;
  refresh: boolean;
}

const ServicioList: React.FC<ServicioListProps> = ({ onEdit, onDelete, refresh }) => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchServicios();
  }, [refresh]);

  const fetchServicios = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/servicios');
      setServicios(response.data.body);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      setError('Error al obtener los servicios.');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(servicios.length / itemsPerPage);
  const currentServicios = servicios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return <div>Cargando servicios...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Lista de Servicios</h2>
      <table className="table table-custom">
        <thead>
          <tr>
            <th>ID</th>
            <th>Servicio</th>
            <th>Costo Mano de Obra</th>
            <th>Precio de Repuestos</th>
            <th>Precio Total</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentServicios.length > 0 ? (
            currentServicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.id}</td>
                <td>{servicio.servicio}</td>
                <td>{servicio.costo_mano_obra}</td>
                <td>{servicio.precio_repuesto}</td>
                <td>{servicio.precio_total}</td>
                <td>{servicio.descripcion}</td>
                <td className="actions-cell">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="icon-button edit-icon"
                    onClick={() => onEdit(servicio)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon-button delete-icon"
                    onClick={() => onDelete(servicio.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No hay servicios disponibles</td>
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

export default ServicioList;
