import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    fetchProveedores();
  }, [refresh]);

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/proveedor');
      
      // Cambiamos a response.data.body ya que body parece contener los datos reales
      if (Array.isArray(response.data.body)) {
        console.log(response.data.body); // Verificar los datos que estamos obteniendo
        setProveedores(response.data.body); // Asignamos los proveedores al estado
      } else {
        console.error('La estructura de la respuesta no es válida');
        setError('La estructura de la respuesta no es válida.');
      }
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      setError('Error al obtener los proveedores.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando proveedores...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Lista de Proveedores</h2>
      <table>
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
          {proveedores.length > 0 ? (
            proveedores.map((proveedor) => (
              <tr key={proveedor.id}>
                <td>{proveedor.id}</td>
                <td>{proveedor.nombre}</td>
                <td>{proveedor.nit}</td>
                <td>{proveedor.dpi}</td>
                <td>{proveedor.razonSocial}</td>
                <td>{proveedor.telefono}</td>
                <td>
                  <button onClick={() => onEdit(proveedor)}>Editar</button>
                  <button onClick={() => onDelete(proveedor.id)}>Eliminar</button>
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
    </div>
  );
};

export default ProveedorList;
