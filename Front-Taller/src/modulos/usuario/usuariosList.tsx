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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

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

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const currentUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          {currentUsers.map(user => (
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
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            disabled={currentPage === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default UserList;
