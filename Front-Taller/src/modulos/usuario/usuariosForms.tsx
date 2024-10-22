import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col } from 'react-bootstrap'; // Usamos Row y Col para la disposición horizontal

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

  // Función para manejar los cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Si el input es de tipo checkbox, se usa la propiedad 'checked', de lo contrario se usa 'value'
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
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
    <div className="container-fluid w-100"> {/* Expandimos el contenedor para que ocupe el espacio */}
      <h2>{userToEdit ? 'Editar Usuario' : 'Ingresar Usuario'}</h2>
      <Form onSubmit={handleSubmit} className="form-horizontal">
        <Row>
          <Col>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                placeholder="Nombre"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={formData.apellido}
                placeholder="Apellido"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="nombreUsuario">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                placeholder="Nombre de Usuario"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="contraseña">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="contraseña"
                value={formData.contraseña}
                placeholder="Contraseña"
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col>
            <Form.Group controlId="rol">
              <Form.Label>Rol</Form.Label>
              <Form.Control as="select" name="rol" value={formData.rol} onChange={handleChange}>
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="estado" className="form-check">
              <Form.Check
                type="checkbox"
                label="Activo"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-3">
          <button type="submit" className={userToEdit ? "btn btn-update" : "btn btn-submit"}>
            {userToEdit ? 'Actualizar' : 'Agregar'}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default UserForm;
