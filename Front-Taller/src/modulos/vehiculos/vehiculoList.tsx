import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
    estadoActual: string;
    historialReparaciones: string;
}

interface VehiculoListProps {
    onEdit: (vehiculo: Vehiculo) => void;
    onDelete: (id: number) => void;
    refresh: boolean; // Para forzar la recarga de los datos cuando se actualiza algo
}

const VehiculoList: React.FC<VehiculoListProps> = ({ onEdit, onDelete, refresh }) => {
    const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchVehiculos();
    }, [refresh]);

    const fetchVehiculos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/vehiculos');
            
            // Verifica la estructura de la respuesta en la consola
            console.log('Respuesta del servidor:', response.data);

            // Ajuste para acceder a los datos dentro de `response.data.body`
            if (Array.isArray(response.data.body)) {
                setVehiculos(response.data.body);  // Asignar los datos de `body` al estado
            } else {
                setError('La estructura de la respuesta no es válida.');
            }
        } catch (error) {
            console.error('Error al obtener vehículos:', error);
            setError('Error al obtener los vehículos.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Cargando vehículos...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h2>Lista de Vehículos</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Placa</th>
                        <th>Estado Actual</th>
                        <th>Historial de Reparaciones</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {vehiculos.length > 0 ? (
                        vehiculos.map((vehiculo) => (
                            <tr key={vehiculo.id}>
                                <td>{vehiculo.id}</td>
                                <td>{vehiculo.marca}</td>
                                <td>{vehiculo.modelo}</td>
                                <td>{vehiculo.placa}</td>
                                <td>{vehiculo.estadoActual}</td>
                                <td>{vehiculo.historialReparaciones}</td>
                                <td>
                                    <button onClick={() => onEdit(vehiculo)}>Editar</button>
                                    <button onClick={() => onDelete(vehiculo.id)}>Eliminar</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7}>No hay vehículos disponibles</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default VehiculoList;
