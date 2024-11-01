import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Orden {
  id?: number;
  numeroOrden: number;
  detalleReparacion: string;
  costoEstimado: number;
  estado: string;
  marca?: string;
  placa?: string;
  nombreCliente?: string;
  nombreMecanico?: string;
  estadoPago: string;
  tipoPago: string;
  idVehiculo: number;
  idCliente: number;
  idMecanico: number;
  concepto: string;
  combustible: string;
  idServicio: number;
  adelantoEmpresa: number;
  fechaIngreso: string;
}

interface Cliente {
  id: number;
  nombre: string;
}

interface Vehiculo {
  id: number;
  marca: string;
  placa: string;
}

interface Mecanico {
  id: number;
  nombre: string;
}

interface OrdenListProps {
  onEdit: (orden: Orden) => void;
  onDelete: (id: number) => void;
  refresh: boolean;
}

const OrdenList: React.FC<OrdenListProps> = ({ onEdit, onDelete, refresh }) => {
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchOrdenes();
  }, [refresh]);

  const fetchOrdenes = async () => {
    try {
      const [ordenesResponse, clientesResponse, vehiculosResponse, mecanicosResponse] = await Promise.all([
        axios.get('http://localhost:4000/api/ordenes'),
        axios.get('http://localhost:4000/api/clientes'),
        axios.get('http://localhost:4000/api/vehiculos'),
        axios.get('http://localhost:4000/api/mecanico')
      ]);

      const clientes: Cliente[] = clientesResponse.data.body;
      const vehiculos: Vehiculo[] = vehiculosResponse.data.body;
      const mecanicos: Mecanico[] = mecanicosResponse.data.body;

      const ordenesConNombres = ordenesResponse.data.body.map((orden: Orden) => {
        const cliente = clientes.find(c => c.id === orden.idCliente);
        const vehiculo = vehiculos.find(v => v.id === orden.idVehiculo);
        const mecanico = mecanicos.find(m => m.id === orden.idMecanico);

        return {
          ...orden,
          nombreCliente: cliente ? cliente.nombre : "No disponible",
          marca: vehiculo ? vehiculo.marca : "No disponible",
          placa: vehiculo ? vehiculo.placa : "No disponible",
          nombreMecanico: mecanico ? mecanico.nombre : "No disponible"
        };
      });

      setOrdenes(ordenesConNombres);
    } catch (error) {
      console.error('Error al obtener órdenes:', error);
      setError('Error al obtener las órdenes.');
      setOrdenes([]);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(ordenes.length / itemsPerPage);
  const currentOrdenes = ordenes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <h2>Lista de Órdenes de Servicio</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Vehículo (Placa)</th>
            <th>Mecánico</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentOrdenes.length > 0 ? (
            currentOrdenes.map((orden) => (
              <tr key={orden.id}>
                <td>{orden.nombreCliente}</td>
                <td>{orden.marca} ({orden.placa})</td>
                <td>{orden.nombreMecanico}</td>
                <td>{orden.estado}</td>
                <td className="actions-cell">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="icon-button edit-icon"
                    onClick={() => onEdit(orden)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon-button delete-icon"
                    onClick={() => onDelete(orden.id || 0)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No hay órdenes disponibles</td>
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

export default OrdenList;
