// src/modulos/reportes/ComprasPorMesChart.tsx

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

interface ComprasPorMesData {
  mes: number; // Índice del mes (1 para enero, 2 para febrero, etc.)
  mesNombre: string; // Nombre del mes en español
  cantidad: number;
}

// Lista completa de los nombres de los meses en español
const mesesNombres = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

// Paleta de colores para cada mes
const mesColors = [
  '#FF6384', // Enero - Rojo claro
  '#36A2EB', // Febrero - Azul claro
  '#FFCE56', // Marzo - Amarillo claro
  '#4BC0C0', // Abril - Turquesa
  '#9966FF', // Mayo - Violeta
  '#FF9F40', // Junio - Naranja claro
  '#FF6384', // Julio - Rojo claro
  '#36A2EB', // Agosto - Azul claro
  '#FFCE56', // Septiembre - Amarillo claro
  '#BDB76B', // Octubre - Turquesa
  '#A9A9A9', // Noviembre - Violeta
  '#FF9F40'  // Diciembre - Naranja claro
];

const ComprasPorMesChart: React.FC = () => {
  const [comprasData, setComprasData] = useState<ComprasPorMesData[]>([]);

  useEffect(() => {
    const fetchComprasPorMes = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/compras/mes');
        const data = response.data.body;

        // Crear un arreglo de datos que incluya todos los meses
        const dataCompleta = mesesNombres.map((mesNombre, index) => {
          const mesData = data.find((item: ComprasPorMesData) => item.mes === index + 1);
          return {
            mes: index + 1, // Índice del mes
            mesNombre, // Nombre del mes en español
            cantidad: mesData ? mesData.cantidad : 0, // Si no hay datos para el mes, se pone 0
          };
        });

        setComprasData(dataCompleta);
      } catch (error) {
        console.error('Error al obtener datos de compras por mes:', error);
      }
    };
    
    fetchComprasPorMes();
  }, []);

  const data = {
    labels: mesesNombres, // Usar los nombres de los meses en español como etiquetas
    datasets: [
      {
        label: 'Compras por Mes',
        data: comprasData.map((item) => item.cantidad),
        backgroundColor: mesColors, // Aplicar la paleta de colores
        borderColor: mesColors, // Borde del mismo color que el fondo
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h3>Compras por Mes</h3>
      <Bar data={data} options={options} />
    </div>
  );
};

export default ComprasPorMesChart;
