import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Proveedor {
    id?: number;
    nombre: string;
    nit: string;
    dpi: string;
    razonSocial: string;
    telefono: string;
}

interface ProveedorFormProps {
    proveedorToEdit: Proveedor | null;
    onSave: () => void;
}

const ProveedorForm: React.FC<ProveedorFormProps> = ({ proveedorToEdit, onSave }) => {
    const [formData, setFormData] = useState<Proveedor>({
        nombre: '',
        nit: '',
        dpi: '',
        razonSocial: '',
        telefono: '',
    });

    useEffect(() => {
        if (proveedorToEdit) {
            setFormData({
                id: proveedorToEdit.id,
                nombre: proveedorToEdit.nombre,
                nit: proveedorToEdit.nit,
                dpi: proveedorToEdit.dpi,
                razonSocial: proveedorToEdit.razonSocial,
                telefono: proveedorToEdit.telefono,
            });
        }
    }, [proveedorToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (proveedorToEdit && proveedorToEdit.id) {
                // Actualizar proveedor existente
                await axios.put(`http://localhost:4000/api/proveedor/${proveedorToEdit.id}`, formData); // Usar el ID correcto en la URL
                alert('Proveedor actualizado');
            } else {
                // Crear nuevo proveedor
                await axios.post('http://localhost:4000/api/proveedor', formData);
                alert('Proveedor creado');
            }
            onSave();
        } catch (error) {
            console.error('Error al guardar proveedor:', error);
        }
    };

    return (
        <div>
            <h2>{proveedorToEdit ? 'Editar Proveedor' : 'Agregar Proveedor'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="nit"
                    placeholder="NIT"
                    value={formData.nit}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="dpi"
                    placeholder="DPI"
                    value={formData.dpi}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="razonSocial"
                    placeholder="Razón Social"
                    value={formData.razonSocial}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="telefono"
                    placeholder="Teléfono"
                    value={formData.telefono}
                    onChange={handleChange}
                />
                <button type="submit">{proveedorToEdit ? 'Actualizar' : 'Agregar'}</button>
            </form>
        </div>
    );
};

export default ProveedorForm;
