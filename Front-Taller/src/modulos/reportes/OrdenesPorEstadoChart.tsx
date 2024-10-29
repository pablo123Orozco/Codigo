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

      setChartData({
        labels,
        datasets: [
          {
            label: 'Órdenes por Estado',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
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
    <div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
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
              type: 'category', // Especifica la escala de categorías
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
