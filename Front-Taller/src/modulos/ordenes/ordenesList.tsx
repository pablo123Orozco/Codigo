import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';

interface OrdenService {
    id: number;
    numeroOrden: number;
    costoEstimado: number;
    estado: string;
    marca: string;
    placa: string;
    nombreCliente: string;  
    estadoPago: string;  
    detalleReparacion: string;
    idVehiculo: number;
    modelo: string;
}

interface OrdenServiceListProps {
    onEdit: (orden: OrdenService) => void;
    onDelete: (id: number) => Promise<void>;
    refresh: boolean;
}

const OrdenServiceList: React.FC<OrdenServiceListProps> = ({ onEdit, onDelete, refresh }) => {
    const [ordenes, setOrdenes] = useState<OrdenService[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrdenes = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/ordenes');
                setOrdenes(response.data.body);
                setLoading(false);
            } catch (error) {
                setError('Error al obtener órdenes');
                setLoading(false);
            }
        };

        fetchOrdenes();
    }, [refresh]);

    if (loading) return <div>Cargando órdenes...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h2>Lista de Órdenes de Servicio</h2>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Número de Orden</th>
                        <th>Vehículo (Marca y Placa)</th>
                        <th>Cliente</th>
                        <th>Costo Estimado</th>
                        <th>Estado del Pago</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenes.map((orden) => (
                        <tr key={orden.id}>
                            <td>{orden.numeroOrden}</td>
                            <td>{orden.marca} - {orden.placa}</td>
                            <td>{orden.nombreCliente}</td>
                            <td>{orden.costoEstimado}</td>
                            <td>{orden.estadoPago}</td>
                            <td>
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        ...
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => onEdit(orden)}>Editar</Dropdown.Item>
                                        <Dropdown.Item onClick={() => onDelete(orden.id)}>Eliminar</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdenServiceList;