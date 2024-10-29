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
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
