import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

interface Vehiculo {
  id: number;
  marca: string;
  modelo: string;
  placa: string;
  estadoActual: string;
  year: string;
}

interface VehiculoListProps {
  onEdit: (vehiculo: Vehiculo) => void;
  refresh: boolean;
}

const VehiculoList: React.FC<VehiculoListProps> = ({ onEdit, refresh }) => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/vehiculos');
        setVehiculos(response.data.body);
        setError(null);
      } catch (error) {
        console.error('Error al obtener los vehículos:', error);
        setError('Error al obtener los datos de vehículos.');
      }
    };

    fetchVehiculos();
  }, [refresh]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(vehiculos.length / itemsPerPage);
  const currentVehiculos = vehiculos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-custom">
      <h2>Lista de Vehículos</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="table table-custom">
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Placa</th>
            <th>Estado Actual</th>
            <th>Año</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentVehiculos.length > 0 ? (
            currentVehiculos.map((vehiculo) => (
              <tr key={vehiculo.id}>
                <td>{vehiculo.id}</td>
                <td>{vehiculo.marca}</td>
                <td>{vehiculo.modelo}</td>
                <td>{vehiculo.placa}</td>
                <td>{vehiculo.estadoActual}</td>
                <td>{vehiculo.year}</td>
                <td className="actions-cell">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="icon-button edit-icon"
                    onClick={() => onEdit(vehiculo)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No hay vehículos disponibles</td>
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

export default VehiculoList;
