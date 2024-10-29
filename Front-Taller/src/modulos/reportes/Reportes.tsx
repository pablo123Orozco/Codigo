import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../../componentes/navbar';
import Sidebar from '../../componentes/Sidebar';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './repo.css';

type ReportData = {
    id: number;
    detalleReparacion: string;
    costoEstimado: number;
    estado: string;
    estadoPago: string;
    tipoPago: string;
    fechaIngreso: string;
    nombreCliente: string;
};

const ReportesModule: React.FC = () => {
    const [placa, setPlaca] = useState('');
    const [reporteData, setReporteData] = useState<ReportData[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [sugerencias, setSugerencias] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const toggleSidebar = (isOpen: boolean): void => {
        setIsSidebarOpen(isOpen);
    };

    const generarInforme = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/ordenes/historial/${placa}`);
            if (response.data && Array.isArray(response.data)) {
                setReporteData(response.data);
                setError(null);
                setShowSuggestions(false);
            } else {
                setReporteData([]);
                setError("No se encontraron datos para la placa ingresada.");
            }
        } catch (err) {
            console.error('Error al generar el informe:', err);
            setError('Ocurrió un error al obtener el reporte. Por favor, intenta nuevamente.');
            setReporteData([]);
        }
    };

    const obtenerSugerencias = async (query: string) => {
        if (query.length > 1) {
            try {
                const response = await axios.get(`http://localhost:4000/api/vehiculos/sugerencias/${query}`);
                setSugerencias(response.data.body);
                setShowSuggestions(true);
            } catch (err) {
                console.error('Error al obtener sugerencias:', err);
            }
        } else {
            setShowSuggestions(false);
        }
    };

    const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPlaca(value);
        obtenerSugerencias(value);
    };

    const seleccionarSugerencia = (sugerencia: string) => {
        setPlaca(sugerencia);
        setShowSuggestions(false);
    };

    const imprimirPDF = () => {
        const doc = new jsPDF();
        
        // Título del PDF
        doc.text("Historial de Órdenes de Servicio", 14, 20);
        
        // Configuración de las columnas y datos
        const columns = ["Cliente", "Detalle de Reparación", "Costo Estimado", "Estado", "Estado de Pago", "Tipo de Pago", "Fecha de Ingreso"];
        const rows = reporteData.map(orden => [
            orden.nombreCliente,
            orden.detalleReparacion,
            orden.costoEstimado,
            orden.estado,
            orden.estadoPago,
            orden.tipoPago,
            new Date(orden.fechaIngreso).toLocaleDateString()
        ]);
        
        // Agregar tabla al PDF
        doc.autoTable({
            startY: 30,
            head: [columns],
            body: rows,
            theme: 'grid',
        });

        // Guardar el archivo PDF
        doc.save("Historial_Ordenes_Servicio.pdf");
    };

    return (
        <div className="dashboard-wrapper">
            <Navbar isSidebarOpen={isSidebarOpen} />
            <div className={`dashboard-container${isSidebarOpen ? ' dashboard-container--shift' : ''}`}>
                <Sidebar toggleSidebar={toggleSidebar} />
                <div className="content">
                    <h2>Informe por Cliente</h2>
                    <div className="formulario">
                        <label>Placa del Vehículo:</label>
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Ingrese la placa..."
                                value={placa}
                                onChange={handlePlacaChange}
                                className="input-placa"
                            />
                            <button onClick={generarInforme} className="btn-generar">Generar</button>
                            <button onClick={imprimirPDF} className="btn-imprimir">Imprimir PDF</button>
                        </div>
                        {showSuggestions && (
                            <ul className="suggestions">
                                {sugerencias.map((sug, index) => (
                                    <li key={index} onClick={() => seleccionarSugerencia(sug)}>
                                        {sug}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="reporte-resultados">
                        <h3>Historial de Órdenes de Servicio</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Detalle de Reparación</th>
                                    <th>Costo Estimado</th>
                                    <th>Estado</th>
                                    <th>Estado de Pago</th>
                                    <th>Tipo de Pago</th>
                                    <th>Fecha de Ingreso</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reporteData.length > 0 ? (
                                    reporteData.map((orden) => (
                                        <tr key={orden.id}>
                                            <td>{orden.nombreCliente}</td>
                                            <td>{orden.detalleReparacion}</td>
                                            <td>{orden.costoEstimado}</td>
                                            <td>{orden.estado}</td>
                                            <td>{orden.estadoPago}</td>
                                            <td>{orden.tipoPago}</td>
                                            <td>{new Date(orden.fechaIngreso).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: 'center' }}>
                                            No hay datos para mostrar. Ingresa una placa y genera el reporte.
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

export default ReportesModule;
