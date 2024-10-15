import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface OrdenService {
    id: number;
    detalleReparacion: string;
    costoEstimado: number;
    estado: string;
    idVehiculo: number;
    marca: string;  // Campos adicionales para mostrar marca y modelo del vehículo
    modelo: string;
}

interface OrdenServiceListProps {
    onEdit: (orden: OrdenService) => void;
    onDelete: (id: number) => void;
    refresh: boolean;
}

const OrdenServiceList: React.FC<OrdenServiceListProps> = ({ onEdit, onDelete, refresh }) => {
    const [ordenes, setOrdenes] = useState<OrdenService[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrdenes();
    }, [refresh]);

    const fetchOrdenes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/ordenes');
            console.log('Respuesta de la API:', response.data); // Verificar la estructura de la respuesta
            // Aquí accedemos a 'body' en lugar de 'response.data'
            if (response.data && Array.isArray(response.data.body)) {
                setOrdenes(response.data.body);  // Almacenar los datos dentro de 'body'
            } else {
                setError('Error al obtener las órdenes de servicio.');
            }
        } catch (error) {
            console.error('Error al obtener órdenes de servicio:', error);
            setError('Error al obtener las órdenes de servicio.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Cargando órdenes de servicio...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Lista de Órdenes de Servicio</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Detalle de Reparación</th>
                        <th>Costo Estimado</th>
                        <th>Estado</th>
                        <th>ID Vehículo</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {ordenes.length > 0 ? (
                        ordenes.map((orden) => (
                            <tr key={orden.id}>
                                <td>{orden.id}</td>
                                <td>{orden.detalleReparacion}</td>
                                <td>{orden.costoEstimado}</td>
                                <td>{orden.estado}</td>
                                <td>{orden.idVehiculo}</td>
                                <td>{orden.marca}</td>
                                <td>{orden.modelo}</td>
                                <td>
                                    <button onClick={() => onEdit(orden)}>Editar</button>
                                    <button onClick={() => onDelete(orden.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8}>No hay órdenes de servicio disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrdenServiceList;
