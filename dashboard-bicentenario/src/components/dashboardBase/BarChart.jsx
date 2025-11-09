// components/dashboard/BarChart.jsx
import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { porSectorEconomico } from '../../services/dashboardBaseService';
import '../../css/dashboardBase.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const extractValue = (data) => {
  if (typeof data === 'number') return data;
  if (typeof data === 'string') return parseFloat(data) || 0;
  if (typeof data === 'object' && data !== null) {
    const numericValues = Object.values(data).filter(val => 
      typeof val === 'number' || !isNaN(parseFloat(val))
    );
    return numericValues.length > 0 ? numericValues[0] : 0;
  }
  return 0;
};

const normalizeArrayData = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'object' && item !== null) {
        return {
          label: item.label || item.name || item.sector || item.tipo || 'Item',
          value: extractValue(item.value || item.count || item.promedio || item),
          unit: item.unit || ''
        };
      }
      return {
        label: 'Item',
        value: extractValue(item),
        unit: ''
      };
    });
  }
  return [];
};

const BarChart = ({ title = "Sectores Económicos", xAxisLabel = "Sectores", yAxisLabel = "Cantidad" }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const sectors = await porSectorEconomico();
        const normalizedData = normalizeArrayData(sectors);
        setData(normalizedData);
      } catch (error) {
        console.error('Error al obtener datos de sectores:', error);
        setError('Error al cargar datos del gráfico');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current && data.length > 0 && !loading) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new ChartJS(ctx, {
        type: 'bar',
        data: {
          labels: data.map(item => item.label),
          datasets: [
            {
              label: yAxisLabel,
              data: data.map(item => item.value),
              backgroundColor: 'rgba(191, 174, 164, 0.8)',
              borderColor: '#072D42',
              borderWidth: 2,
              borderRadius: 8,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#072D42',
                font: {
                  family: 'Inter',
                  size: 12,
                },
              },
            },
            title: {
              display: true,
              text: title,
              color: '#072D42',
              font: {
                family: 'Plus Jakarta Sans',
                size: 16,
                weight: '600',
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(70, 78, 89, 0.1)',
              },
              ticks: {
                color: '#464E59',
                font: {
                  family: 'Inter',
                },
              },
            },
            y: {
              grid: {
                color: 'rgba(70, 78, 89, 0.1)',
              },
              ticks: {
                color: '#464E59',
                font: {
                  family: 'Inter',
                },
              },
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, loading, title, xAxisLabel, yAxisLabel]);

  if (loading) {
    return (
      <div className="loading-placeholder">
        <p>Cargando gráfico...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
};

export default BarChart;