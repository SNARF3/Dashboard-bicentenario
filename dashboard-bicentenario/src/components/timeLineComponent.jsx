// components/LineChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ 
  data, 
  title, 
  xAxisLabel = 'Años',
  yAxisLabel = 'Cantidad',
  backgroundColor = 'rgba(75, 192, 192, 0.2)',
  borderColor = 'rgba(75, 192, 192, 1)',
  className = ''
}) => {
  const chartData = {
    labels: data.map(item => item.year || item.label),
    datasets: [
      {
        label: title,
        data: data.map(item => item.value),
        backgroundColor,
        borderColor,
        borderWidth: 2,
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
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
          text: xAxisLabel,
        },
      },
      y: {
        title: {
          display: true,
          text: yAxisLabel,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className={`line-chart ${className}`}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChart;