import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Vehiculo {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
    estadoActual: string;
    year: string;
}

interface VehiculoListProps {
    onEdit: (vehiculo: Vehiculo) => void;
    onDelete: (id: number) => void;
    refresh: boolean;
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
            if (Array.isArray(response.data.body)) {
                setVehiculos(response.data.body);
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
        <div className="container-custom">
            <h2>Lista de Vehículos</h2>
            <table className="table table-custom">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Marca</th>
                        <th>Modelo</th>
                        <th>Placa</th>
                        <th>Estado Actual</th>
                        <th>Año</th>
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
                                <td>{vehiculo.year}</td>
                                <td>
                                    <button className="btn btn-edit" onClick={() => onEdit(vehiculo)}>Editar</button>
                                    <button className="btn btn-delete" onClick={() => onDelete(vehiculo.id)}>Eliminar</button>
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
