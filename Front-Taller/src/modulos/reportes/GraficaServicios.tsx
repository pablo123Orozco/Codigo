// src/modulos/reportes/ServiciosMasSolicitadosChart.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ServiciosMasSolicitadosChart: React.FC = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    const fetchServiciosMasSolicitados = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/ordenes/servicios-mas-solicitados');
        const servicios = response.data.body;
        
        // Extraer nombres de servicios y sus cantidades
        const labels = servicios.map((servicio: { nombreServicio: string }) => servicio.nombreServicio);
        const data = servicios.map((servicio: { cantidad: number }) => servicio.cantidad);
        
        setLabels(labels);
        setData(data);
      } catch (error) {
        console.error('Error al obtener los servicios más solicitados:', error);
      }
    };

    fetchServiciosMasSolicitados();
  }, []);

  // Definir una paleta de colores
  const backgroundColors = [
    '#2b5a8a', // Rojo claro
    '#708090', // Azul claro
    '#708090', // Amarillo claro
    '#808000', // Turquesa
    '#00008B', // Violeta
    '#008B8B', // Naranja claro
  ];

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Cantidad de Servicios',
        data: data,
        backgroundColor: backgroundColors, // Aplica la paleta de colores
        borderColor: backgroundColors.map(color => color), // Borde del mismo color que el fondo
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Servicios Más Solicitados',
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            return `${context.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 90, // Rotación completa para etiquetas verticales
          minRotation: 90,
          font: {
            size: 10, // Tamaño de fuente más pequeño para mayor claridad
          },
          callback: function(value: any, index: number, values: any) {
            // Recorta el texto si es demasiado largo
            const label = labels[value] || '';
            return label.length > 10 ? label.substr(0, 10) + '...' : label;
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '96%', height: '317px', margin: '0 auto' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ServiciosMasSolicitadosChart;
