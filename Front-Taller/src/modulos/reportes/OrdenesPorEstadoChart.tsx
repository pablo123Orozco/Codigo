import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrdenesPorEstadoChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  const fetchOrdenesPorEstado = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/ordenes/estado');
      const data = response.data.body;

      const labels = data.map((estado: any) => estado.estado);
      const counts = data.map((estado: any) => estado.cantidad);

      // Definir colores basados en el estado usando códigos hexadecimales
      const backgroundColors = data.map((estado: any) => {
        if (estado.estado === 'Completado') return '#008000'; // Verde
        if (estado.estado === 'Pendiente') return '#FF0000'; // Rojo
        if (estado.estado === 'aprobado') return '#FFFF00'; // Amarillo
        return '#4BC0C0'; // Color por defecto (En Progreso)
      });

      setChartData({
        labels,
        datasets: [
          {
            label: 'Órdenes por Estado',
            data: counts,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors, // Usar el mismo color de fondo para el borde
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching ordenes por estado:', error);
    }
  };

  useEffect(() => {
    fetchOrdenesPorEstado();
  }, []);

  return (
    <div style={{ width: '96%', height: '317px', margin: '0 auto' }}>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: 'Órdenes por Estado',
            },
          },
          scales: {
            x: {
              type: 'category',
              title: {
                display: true,
                text: 'Estado',
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad',
              },
            },
          },
        }}
      />
    </div>
  );
};

export default OrdenesPorEstadoChart;
