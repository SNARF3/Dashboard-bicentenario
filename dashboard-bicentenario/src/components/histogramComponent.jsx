// components/BarChart.jsx
import React from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ 
  data, 
  title, 
  xAxisLabel = 'Sectores Económicos',
  yAxisLabel = 'Cantidad de Empresas',
  backgroundColor = 'rgba(54, 162, 235, 0.6)',
  borderColor = 'rgba(54, 162, 235, 1)',
  className = '',
  horizontal = true
}) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: title,
        data: data.map(item => item.value),
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: horizontal ? yAxisLabel : xAxisLabel,
        },
        beginAtZero: true,
      },
      y: {
        title: {
          display: true,
          text: horizontal ? xAxisLabel : yAxisLabel,
        },
      },
    },
  };

  return (
    <div className={`bar-chart ${className}`} style={{ width: '100%', height: '100%' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;