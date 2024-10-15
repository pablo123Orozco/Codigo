import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id?: number;
  nombre: string;
  apellido: string;
  nombreUsuario: string;
  contraseña?: string;
  estado: boolean;
  rol: string;
}

interface UserFormProps {
  userToEdit: User | null;
  onSave: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ userToEdit, onSave }) => {
  const [formData, setFormData] = useState<User>({
    nombre: '',
    apellido: '',
    nombreUsuario: '',
    contraseña: '',
    estado: true,
    rol: 'usuario',
  });

  useEffect(() => {
    if (userToEdit) {
      setFormData({
        id: userToEdit.id,
        nombre: userToEdit.nombre,
        apellido: userToEdit.apellido,
        nombreUsuario: userToEdit.nombreUsuario,
        contraseña: '',
        estado: userToEdit.estado,
        rol: userToEdit.rol,
      });
    }
  }, [userToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (userToEdit) {
        const updatedUser = { ...formData };
        if (!updatedUser.contraseña) delete updatedUser.contraseña;
        await axios.put(`http://localhost:4000/api/usuarios/${userToEdit.id}`, updatedUser);
        alert('Usuario actualizado');
      } else {
        await axios.post('http://localhost:4000/api/usuarios', formData);
        alert('Usuario creado');
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };

  return (
    <div className="container-custom">
      <h2>{userToEdit ? 'Editar Usuario' : 'Agregar Usuario'}</h2>
      <form className="form-custom" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            placeholder="Nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            className="form-control"
            id="apellido"
            name="apellido"
            placeholder="Apellido"
            value={formData.apellido}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nombreUsuario">Nombre de Usuario</label>
          <input
            type="text"
            className="form-control"
            id="nombreUsuario"
            name="nombreUsuario"
            placeholder="Nombre de Usuario"
            value={formData.nombreUsuario}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="contraseña">Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="contraseña"
            name="contraseña"
            placeholder="Contraseña"
            value={formData.contraseña}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="rol">Rol</label>
          <select
            className="form-control"
            id="rol"
            name="rol"
            value={formData.rol}
            onChange={handleChange}
          >
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="estado"
            name="estado"
            checked={formData.estado}
            onChange={(e) => setFormData({ ...formData, estado: e.target.checked })}
          />
          <label className="form-check-label" htmlFor="estado">
            Activo
          </label>
        </div>
        <button type="submit" className={userToEdit ? "btn btn-update" : "btn btn-submit"}>
          {userToEdit ? 'Actualizar' : 'Agregar'}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
