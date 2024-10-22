import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Mecanico {
  mecanicoId: number;
  nombre: string;
  fecha: string;
}

interface MecanicoListProps {
  onEdit: (mecanico: Mecanico) => void;
  onDelete: (mecanicoId: number) => void;
  refresh: boolean;
}

const MecanicoList: React.FC<MecanicoListProps> = ({ onEdit, onDelete, refresh }) => {
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]);
  const [error, setError] = useState<string | null>(null);

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
            <th>No. Orden Servicio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {mecanicos.length > 0 ? (
            mecanicos.map((mecanico) => (
              <tr key={mecanico.mecanicoId}>
                <td>{mecanico.mecanicoId}</td>
                <td>{mecanico.nombre}</td>
                <td>{mecanico.fecha}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => onEdit(mecanico)}>Editar</button>
                  <button className="btn btn-delete" onClick={() => onDelete(mecanico.mecanicoId)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No hay mecánicos disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MecanicoList;
