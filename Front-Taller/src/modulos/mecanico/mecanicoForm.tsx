import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Mecanico {
  mecanicoId?: number;
  nombre: string;
  fecha: string;
  ordenId: string;
}

interface MecanicoFormProps {
  mecanicoToEdit: Mecanico | null;
  onSave: () => void;
}

const MecanicoForm: React.FC<MecanicoFormProps> = ({ mecanicoToEdit, onSave }) => {
  const [formData, setFormData] = useState<Mecanico>({
    nombre: '',
    fecha: '',
    ordenId: '',
  });

  useEffect(() => {
    if (mecanicoToEdit) {
      setFormData({
        mecanicoId: mecanicoToEdit.mecanicoId,
        nombre: mecanicoToEdit.nombre,
        fecha: mecanicoToEdit.fecha,
        ordenId: mecanicoToEdit.ordenId,
      });
    }
  }, [mecanicoToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Si la fecha incluye la hora, aquí formateamos para tomar solo la parte de la fecha
      const fechaFormateada = new Date(formData.fecha).toISOString().split('T')[0];

      const mecanico = {
        ...formData,
        fecha: fechaFormateada, // Sobrescribimos la fecha para asegurarnos de que solo incluya la fecha sin la hora
      };

      if (mecanicoToEdit && mecanicoToEdit.mecanicoId) {
        // Actualizar mecánico existente
        await axios.put(`http://localhost:4000/api/mecanico/${mecanicoToEdit.mecanicoId}`, mecanico);
        alert('Mecánico actualizado');
      } else {
        // Crear nuevo mecánico
        await axios.post('http://localhost:4000/api/mecanico', mecanico);
        alert('Mecánico creado');
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar el mecánico:', error);
    }
  };

  return (
    <div>
      <h2>{mecanicoToEdit ? 'Editar Mecánico' : 'Agregar Mecánico'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={formData.nombre}
          onChange={handleChange}
        />
        <input
          type="date" // Aseguramos que este input solo capture la fecha sin la hora
          name="fecha"
          placeholder="Fecha"
          value={formData.fecha}
          onChange={handleChange}
        />
        <input
          type="text"
          name="NoOrdenServicio"
          placeholder="No. Orden Servicio"
          value={formData.ordenId}
          onChange={handleChange}
        />
        <button type="submit">{mecanicoToEdit ? 'Actualizar' : 'Agregar'}</button>
      </form>
    </div>
  );
};

export default MecanicoForm;
