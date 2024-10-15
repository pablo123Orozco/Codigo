import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Cliente {
  id?: number;
  nombre: string;
  apellido: string;
  nit: string;
  telefono: string;
  correo: string;
  estadoCuenta: string;
}

interface ClienteFormProps {
  clienteToEdit: Cliente | null;
  onSave: () => void;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ clienteToEdit, onSave }) => {
  const [formData, setFormData] = useState<Cliente>({
    nombre: '',
    apellido: '',
    nit: '',
    telefono: '',
    correo: '',
    estadoCuenta: '',
  });

  useEffect(() => {
    if (clienteToEdit) {
      setFormData({
        id: clienteToEdit.id,
        nombre: clienteToEdit.nombre,
        apellido: clienteToEdit.apellido,
        nit: clienteToEdit.nit,
        telefono: clienteToEdit.telefono,
        correo: clienteToEdit.correo,
        estadoCuenta: clienteToEdit.estadoCuenta,
      });
    }
  }, [clienteToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (clienteToEdit) {
      try {
        await axios.put(`http://localhost:4000/api/clientes/${clienteToEdit.id}`, formData);
        alert('Cliente actualizado');
        onSave();
      } catch (error) {
        console.error('Error al actualizar cliente:', error);
      }
    } else {
      try {
        await axios.post('http://localhost:4000/api/clientes', formData);
        alert('Cliente creado');
        onSave();
      } catch (error) {
        console.error('Error al crear cliente:', error);
      }
    }
  };

  return (
    <div className="container-custom">
      <h2>{clienteToEdit ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
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
          <label htmlFor="nit">NIT</label>
          <input
            type="text"
            className="form-control"
            id="nit"
            name="nit"
            placeholder="NIT"
            value={formData.nit}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="text"
            className="form-control"
            id="telefono"
            name="telefono"
            placeholder="Teléfono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="correo">Correo</label>
          <input
            type="email"
            className="form-control"
            id="correo"
            name="correo"
            placeholder="Correo"
            value={formData.correo}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="estadoCuenta">Estado de Cuenta</label>
          <input
            type="text"
            className="form-control"
            id="estadoCuenta"
            name="estadoCuenta"
            placeholder="Estado de Cuenta"
            value={formData.estadoCuenta}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className={clienteToEdit ? "btn btn-update" : "btn btn-submit"}>
          {clienteToEdit ? 'Actualizar' : 'Agregar'}
        </button>
      </form>
    </div>
  );
};

export default ClienteForm;
