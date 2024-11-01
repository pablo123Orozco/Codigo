import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Alert } from 'react-bootstrap';

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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach((field) => {
      if (!formData[field as keyof User]) {
        newErrors[field] = `El campo ${field} es requerido`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (userToEdit) {
        const updatedUser = { ...formData };
        if (!updatedUser.contraseña) delete updatedUser.contraseña; // No actualiza contraseña si está vacía
        await axios.put(`http://localhost:4000/api/usuarios/${userToEdit.id}`, updatedUser);
      } else {
        await axios.post('http://localhost:4000/api/usuarios', formData);
      }
      onSave(); // Llama a onSave para actualizar el estado en UserModule
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };

  return (
    <div className="container-fluid w-100">
      <h2>{userToEdit ? 'Editar Usuario' : 'Ingresar Usuario'}</h2>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                placeholder="Nombre"
                onChange={handleChange}
              />
              {errors.nombre && <Alert variant="danger">{errors.nombre}</Alert>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="apellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                name="apellido"
                value={formData.apellido}
                placeholder="Apellido"
                onChange={handleChange}
              />
              {errors.apellido && <Alert variant="danger">{errors.apellido}</Alert>}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="nombreUsuario">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                name="nombreUsuario"
                value={formData.nombreUsuario}
                placeholder="Nombre de Usuario"
                onChange={handleChange}
              />
              {errors.nombreUsuario && <Alert variant="danger">{errors.nombreUsuario}</Alert>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="contraseña">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="contraseña"
                value={formData.contraseña}
                placeholder="Contraseña"
                onChange={handleChange}
              />
              {errors.contraseña && <Alert variant="danger">{errors.contraseña}</Alert>}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId="rol">
              <Form.Label>Rol</Form.Label>
              <Form.Control as="select" name="rol" value={formData.rol} onChange={handleChange}>
                <option value="usuario">Usuario</option>
                <option value="admin">Admin</option>
              </Form.Control>
              {errors.rol && <Alert variant="danger">{errors.rol}</Alert>}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="estado" className="form-check">
              <Form.Check
                type="checkbox"
                label="Activo"
                name="estado"
                checked={formData.estado}
                onChange={handleChange}
              />
              {errors.estado && <Alert variant="danger">{errors.estado}</Alert>}
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-3">
          <Button type="submit" variant={userToEdit ? "success" : "primary"}>
            {userToEdit ? 'Actualizar' : 'Agregar'}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default UserForm;
