// src/modulos/reportes/ReporteCompra.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './repo.css';

type CompraData = {
    id: number;
    nombreProducto: string;
    fecha: string;
    total: number;
    estado: string;
    nombreCliente: string;
    marcha: string;
};

const ReporteCompra: React.FC = () => {
    const [nombreCliente, setNombreCliente] = useState('');
    const [compraData, setCompraData] = useState<CompraData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = (isOpen: boolean): void => {
        setIsSidebarOpen(isOpen);
    };

    const generarInforme = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/compras/historial/${nombreCliente}`);
            if (response.data && Array.isArray(response.data.body)) {
                setCompraData(response.data.body);
                setError(null);
            } else {
                setCompraData([]);
                setError("No se encontraron compras para el cliente ingresado.");
            }
        } catch (err) {
            console.error('Error al generar el informe:', err);
            setError('Ocurrió un error al obtener el reporte. Por favor, intenta nuevamente.');
            setCompraData([]);
        }
    };

    const imprimirPDF = () => {
        const doc = new jsPDF();

        // Título del PDF
        doc.text("Historial de Compras", 14, 20);

        // Configuración de las columnas y datos
        const columns = ["ID", "Producto", "Fecha", "Total", "Estado", "Cliente", "Marcha"];
        const rows = compraData.map(compra => [
            compra.id,
            compra.nombreProducto,
            new Date(compra.fecha).toLocaleDateString(),
            compra.total,
            compra.estado,
            compra.nombreCliente,
            compra.marcha,
        ]);

        // Agregar tabla al PDF
        doc.autoTable({
            startY: 30,
            head: [columns],
            body: rows,
            theme: 'grid',
        });

        // Guardar el archivo PDF
        doc.save("Historial_Compras.pdf");
    };

    return (
        <div className="dashboard-wrapper">
            <Navbar isSidebarOpen={isSidebarOpen} />
            <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
                <Sidebar toggleSidebar={toggleSidebar} />
                <div className="content">
                    <h2>Informe de Compras por Cliente</h2>
                    <div className="formulario">
                        <label>Nombre del Cliente:</label>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Ingrese el nombre del cliente..."
                                value={nombreCliente}
                                onChange={(e) => setNombreCliente(e.target.value)}
                                className="input-cliente"
                            />
                            <button onClick={generarInforme} className="btn-generar">Generar</button>
                            <button onClick={imprimirPDF} className="btn-imprimir">Imprimir PDF</button>
                        </div>
                    </div>

                    <div className="reporte-resultados">
                        <h3>Historial de Compras</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Producto</th>
                                    <th>Fecha</th>
                                    <th>Total</th>
                                    <th>Estado</th>
                                    <th>Cliente</th>
                                    <th>Marcha</th>
                                </tr>
                            </thead>
                            <tbody>
                                {compraData.length > 0 ? (
                                    compraData.map((compra) => (
                                        <tr key={compra.id}>
                                            <td>{compra.id}</td>
                                            <td>{compra.nombreProducto}</td>
                                            <td>{new Date(compra.fecha).toLocaleDateString()}</td>
                                            <td>{compra.total}</td>
                                            <td>{compra.estado}</td>
                                            <td>{compra.nombreCliente}</td>
                                            <td>{compra.marcha}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center' }}>
                                            No hay datos para mostrar. Ingresa un nombre de cliente y genera el reporte.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReporteCompra;
