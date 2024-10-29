import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

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
  refresh: boolean;
}

const UserList: React.FC<UserListProps> = ({ onEdit, onDelete, refresh }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, [refresh]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/usuarios');
      setUsers(response.data.body || []);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

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
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.nombre}</td>
              <td>{user.apellido}</td>
              <td>{user.nombreUsuario}</td>
              <td>{user.estado ? 'Activo' : 'Inactivo'}</td>
              <td>{user.rol}</td>
              <td className="actions-cell">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="icon-button edit-icon"
                  onClick={() => onEdit(user)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="icon-button delete-icon"
                  onClick={() => onDelete(user.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
