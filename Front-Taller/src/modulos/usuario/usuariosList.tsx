import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  estado: boolean;
  rol: string;
}

interface UserListProps {
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserList: React.FC<UserListProps> = ({ onEdit, onDelete }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/usuarios');
      if (Array.isArray(response.data.body)) {
        setUsers(response.data.body);
      } else {
        setError('La estructura de la respuesta no es válida.');
      }
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      setError('Error al obtener los usuarios.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Cargando usuarios...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container-custom">
      <h2>Lista de Usuarios</h2>
      <table className="table table-custom">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.apellido}</td>
                <td>{user.nombreUsuario}</td>
                <td>{user.estado ? 'Activo' : 'Inactivo'}</td>
                <td>{user.rol}</td>
                <td>
                  <button className="btn btn-edit" onClick={() => onEdit(user)}>Editar</button>
                  <button className="btn btn-delete" onClick={() => onDelete(user.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7}>No hay usuarios disponibles</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
