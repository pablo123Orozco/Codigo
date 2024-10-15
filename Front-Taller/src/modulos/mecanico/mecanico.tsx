import React, { useState } from 'react';
import MecanicoList from './mecanicoList';
import MecanicoForm from './mecanicoForm';
import axios from 'axios';

interface Mecanico {
  mecanicoId: number; // Ajustamos a mecanicoId
  nombre: string;
  fecha: string;
  ordenId: string; // Este campo también debe estar presente
}

const MecanicoModule: React.FC = () => {
  const [mecanicoToEdit, setMecanicoToEdit] = useState<Mecanico | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleEdit = (mecanico: Mecanico) => {
    setMecanicoToEdit(mecanico);
  };

  const handleDelete = async (mecanicoId: number) => { // Aquí cambiamos a mecanicoId
    try {
      await axios.delete(`http://localhost:4000/api/mecanico/${mecanicoId}`);
      alert('Mecánico eliminado');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error al eliminar mecánico:', error);
    }
  };

  const handleSave = () => {
    setMecanicoToEdit(null);
    setRefresh(!refresh);
  };

  return (
    <div>
      <MecanicoForm mecanicoToEdit={mecanicoToEdit} onSave={handleSave} />
      <MecanicoList onEdit={handleEdit} onDelete={handleDelete} refresh={refresh} />
    </div>
  );
};

export default MecanicoModule;
