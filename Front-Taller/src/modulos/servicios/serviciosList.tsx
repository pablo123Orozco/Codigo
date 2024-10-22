import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Servicio {
  id: number;
  servicio: string;
  costo_mano_obra: number;
  precio_repuesto: number;
  precio_total: number;
  descripcion: string;
  orden_servicio_id: number;
}

interface ServicioListProps {
  onEdit: (servicio: Servicio) => void;
  onDelete: (id: number) => void;
  refresh: boolean; // Para recargar los datos cuando se actualiza algo
}

const ServicioList: React.FC<ServicioListProps> = ({ onEdit, onDelete, refresh }) => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div>Cargando servicios...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Lista de Servicios</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Servicio</th>
            <th>Costo Mano de Obra</th>
            <th>Precio de Repuestos</th>
            <th>Precio Total</th>
            <th>Descripción</th>
            <th>ID Orden Servicio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.length > 0 ? (
            servicios.map((servicio) => (
              <tr key={servicio.id}>
                <td>{servicio.id}</td>
                <td>{servicio.servicio}</td>
                <td>{servicio.costo_mano_obra}</td>
                <td>{servicio.precio_repuesto}</td>
                <td>{servicio.precio_total}</td>
                <td>{servicio.descripcion}</td>
                <td>{servicio.orden_servicio_id}</td>
                <td>
                  <button onClick={() => onEdit(servicio)}>Editar</button>
                  <button onClick={() => onDelete(servicio.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No hay servicios disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ServicioList;
