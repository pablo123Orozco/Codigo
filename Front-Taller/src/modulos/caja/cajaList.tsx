import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Caja {
  id: number;
  concepto: string;
  monto: number;
  tipo: string;
  fecha: string;
  idOrdenServicio: number;
}

interface CajaListProps {
  onEdit: (caja: Caja) => void;
  onDelete: (id: number) => void;
  refresh: boolean;
}

const CajaList: React.FC<CajaListProps> = ({ onEdit, onDelete, refresh }) => {
  const [registros, setRegistros] = useState<Caja[]>([]);
  const [error, setError] = useState<string | null>(null);

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
            <th>Orden de Servicio</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.length > 0 ? (
            registros.map((caja) => (
              <tr key={caja.id}>
                <td>{caja.id}</td>
                <td>{caja.concepto}</td>
                <td>{caja.monto}</td>
                <td>{caja.tipo}</td>
                <td>{new Date(caja.fecha).toISOString().split('T')[0]}</td>
                <td>{caja.idOrdenServicio ? `Orden #${caja.idOrdenServicio}` : 'N/A'}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => onEdit(caja)}>Editar</button>
                  <button className="btn btn-delete" onClick={() => onDelete(caja.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No hay registros disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CajaList;
