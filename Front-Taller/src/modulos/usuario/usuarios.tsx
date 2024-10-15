import React, { useState } from 'react';
import UserList from './usuariosList';
import UserForm from './usuariosForms';
import './usuarios.css';  // Aquí importas el archivo CSS personalizado
import axios from 'axios';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  estado: boolean;
  rol: string;
}

const UserModule: React.FC = () => {
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleEdit = (user: User) => {
    setUserToEdit(user);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:4000/api/usuarios`, { data: { id } });
      alert('Usuario eliminado');
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleSave = () => {
    setUserToEdit(null);
    setRefresh(!refresh);
  };

  return (
    <div>
      <UserForm userToEdit={userToEdit} onSave={handleSave} />
      <UserList onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default UserModule;
