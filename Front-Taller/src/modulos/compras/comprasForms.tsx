import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Compra {
  id?: number;
  nombreProducto: string;
  fecha: string;
  total: number;
  estado: string;
  idProveedor: number;
  idCliente: number;
  marcha: string;
}

interface CompraFormProps {
  compraToEdit: Compra | null;
  onSave: () => void;
}

const CompraForm: React.FC<CompraFormProps> = ({ compraToEdit, onSave }) => {
  const [compra, setCompra] = useState<Compra>({
    nombreProducto: '',
    fecha: '',
    total: 0,
    estado: '',
    idProveedor: 0,
    idCliente: 0,
    marcha: '',
  });

  useEffect(() => {
    if (compraToEdit) {
      // Convertir la fecha al formato "YYYY-MM-DD"
      const fechaFormateada = new Date(compraToEdit.fecha).toISOString().split('T')[0];
      setCompra({
        ...compraToEdit,
        fecha: fechaFormateada,
      });
    }
  }, [compraToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompra({
      ...compra,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (compra.id) {
        await axios.put(`http://localhost:4000/api/compras/${compra.id}`, compra);
        alert('Compra actualizada con éxito');
      } else {
        await axios.post('http://localhost:4000/api/compras', compra);
        alert('Compra creada con éxito');
      }
      onSave();
    } catch (error) {
      console.error('Error al guardar la compra:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{compra.id ? 'Editar Compra' : 'Nueva Compra'}</h2>
      <div>
        <label>Nombre del Producto:</label>
        <input type="text" name="nombreProducto" value={compra.nombreProducto} onChange={handleChange} />
      </div>
      <div>
        <label>Fecha:</label>
        <input type="date" name="fecha" value={compra.fecha} onChange={handleChange} />
      </div>
      <div>
        <label>Total:</label>
        <input type="number" name="total" value={compra.total} onChange={handleChange} />
      </div>
      <div>
        <label>Estado:</label>
        <input type="text" name="estado" value={compra.estado} onChange={handleChange} />
      </div>
      <div>
        <label>Proveedor ID:</label>
        <input type="number" name="idProveedor" value={compra.idProveedor} onChange={handleChange} />
      </div>
      <div>
        <label>Cliente ID:</label>
        <input type="number" name="idCliente" value={compra.idCliente} onChange={handleChange} />
      </div>
      <div>
        <label>Marcha:</label>
        <input type="text" name="marcha" value={compra.marcha} onChange={handleChange} />
      </div>
      <button type="submit">{compra.id ? 'Actualizar Compra' : 'Crear Compra'}</button>
    </form>
  );
};

export default CompraForm;
