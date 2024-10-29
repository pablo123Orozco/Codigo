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

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'Cantidad de Servicios',
        data: data,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ServiciosMasSolicitadosChart;
