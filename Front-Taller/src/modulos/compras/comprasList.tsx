import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Compra {
  id: number;
  nombreProducto: string;
  fecha: string;
  total: number;
  estado: string;
  idProveedor: number;
  idCliente: number;
  marcha: string;
}

interface CompraListProps {
  onEdit: (compra: Compra) => void;
  onDelete: (id: number) => void;
  refresh: boolean; // Para forzar la recarga de los datos cuando se actualiza algo
}

const CompraList: React.FC<CompraListProps> = ({ onEdit, onDelete, refresh }) => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompras();
  }, [refresh]);

  const fetchCompras = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/compras');
      setCompras(response.data.body);
    } catch (error) {
      console.error('Error al obtener compras:', error);
      setError('Error al obtener las compras.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando compras...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Lista de Compras</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Producto</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Proveedor</th>
            <th>Cliente</th>
            <th>Marcha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {compras.length > 0 ? (
            compras.map((compra) => (
              <tr key={compra.id}>
                <td>{compra.id}</td>
                <td>{compra.nombreProducto}</td>
                {/* Formateamos la fecha para quitar la hora */}
                <td>{new Date(compra.fecha).toISOString().split('T')[0]}</td>
                <td>{compra.total}</td>
                <td>{compra.estado}</td>
                <td>{compra.idProveedor}</td>
                <td>{compra.idCliente}</td>
                <td>{compra.marcha}</td>
                <td>
                  <button onClick={() => onEdit(compra)}>Editar</button>
                  <button onClick={() => onDelete(compra.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>No hay compras disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompraList;
