import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Compra {
  id: number;
  nombreProducto: string;
  fecha: string;
  total: number;
  estado: string;
  idProveedor: number;
  idCliente: number;
  marcha: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

interface Cliente {
  id: number;
  nombre: string;
}

interface CompraListProps {
  onEdit: (compra: Compra) => void;
  onDelete: (id: number) => void;
  refresh: boolean;
}

const CompraList: React.FC<CompraListProps> = ({ onEdit, onDelete, refresh }) => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCompras();
    fetchProveedores();
    fetchClientes();
  }, [refresh]);

  const fetchCompras = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/compras');
      setCompras(response.data.body);
    } catch (error) {
      console.error('Error al obtener compras:', error);
      setError('Error al obtener las compras.');
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/proveedor');
      setProveedores(response.data.body);
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/clientes');
      setClientes(response.data.body);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
    }
  };

  const getProveedorNombre = (idProveedor: number) => {
    const proveedor = proveedores.find((prov) => prov.id === idProveedor);
    return proveedor ? proveedor.nombre : 'Proveedor no encontrado';
  };

  const getClienteNombre = (idCliente: number) => {
    const cliente = clientes.find((cli) => cli.id === idCliente);
    return cliente ? cliente.nombre : 'Cliente no encontrado';
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(compras.length / itemsPerPage);
  const currentCompras = compras.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container-custom">
      <h2>Lista de Compras</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="table table-custom">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Producto</th>
            <th>Fecha</th>
            <th>Total</th>
            <th>Estado</th>
            <th>Proveedor</th>
            <th>Cliente</th>
            <th>Marcha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentCompras.length > 0 ? (
            currentCompras.map((compra) => (
              <tr key={compra.id}>
                <td>{compra.id}</td>
                <td>{compra.nombreProducto}</td>
                <td>{new Date(compra.fecha).toISOString().split('T')[0]}</td>
                <td>{compra.total}</td>
                <td>{compra.estado}</td>
                <td>{getProveedorNombre(compra.idProveedor)}</td>
                <td>{getClienteNombre(compra.idCliente)}</td>
                <td>{compra.marcha}</td>
                <td className="actions-cell">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="icon-button edit-icon"
                    onClick={() => onEdit(compra)}
                  />
                  <FontAwesomeIcon
                    icon={faTrash}
                    className="icon-button delete-icon"
                    onClick={() => onDelete(compra.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9}>No hay compras disponibles</td>
            </tr>
          )}
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

export default CompraList;
