import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Mecanico {
  mecanicoId: number; // Usamos mecanicoId en lugar de id
  nombre: string;
  fecha: string;
  ordenId: string;
}

interface MecanicoListProps {
  onEdit: (mecanico: Mecanico) => void;
  onDelete: (mecanicoId: number) => void; // Cambiamos id por mecanicoId
  refresh: boolean;
}

const MecanicoList: React.FC<MecanicoListProps> = ({ onEdit, onDelete, refresh }) => {
  const [mecanicos, setMecanicos] = useState<Mecanico[]>([]); // Inicializamos el array vacío
  const [error, setError] = useState<string | null>(null); // Para manejar errores

  useEffect(() => {
    const fetchMecanicos = async () => {
      try {
        // Realizamos la solicitud GET al backend
        const response = await axios.get('http://localhost:4000/api/mecanico');
        console.log('Datos recibidos del backend:', response.data);
        const mecanicosData = response.data.body; // Accedemos al campo body de la respuesta

        if (Array.isArray(mecanicosData)) {
          setMecanicos(mecanicosData); // Asignamos los datos al estado
          setError(null); // Si todo va bien, eliminamos cualquier error
        } else {
          throw new Error('La respuesta no es un array válido en "body"');
        }
      } catch (err) {
        console.error('Error al obtener los mecánicos:', err);
        setError('Hubo un error al obtener los datos de mecánicos.'); // Mostramos un mensaje de error
      }
    };

    fetchMecanicos(); // Llama a la función cuando se monta el componente o cuando se actualiza `refresh`
  }, [refresh]);

  return (
    <div>
      <h2>Lista de Mecánicos</h2>
      {/* Si hay un error, lo mostramos */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {mecanicos.length > 0 ? (
          mecanicos.map((mecanico) => (
            <li key={mecanico.mecanicoId}> {/* Usamos mecanicoId como clave única */}
              {mecanico.nombre} - 
              {/* Formateamos la fecha para mostrar solo la parte de la fecha sin la hora */}
              {new Date(mecanico.fecha).toISOString().split('T')[0]} - Orden ID: {mecanico.ordenId}
              <button onClick={() => onEdit(mecanico)}>Editar</button>
              <button onClick={() => onDelete(mecanico.mecanicoId)}>Eliminar</button>
            </li>
          ))
        ) : (
          <li>No hay mecánicos disponibles</li>
        )}
      </ul>
    </div>
  );
};

export default MecanicoList;
