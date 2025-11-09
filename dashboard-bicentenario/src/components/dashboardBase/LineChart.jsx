import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { empresasPorAnio } from '../../services/dashboardBaseService';
import '../../css/dashboardBase.css';

// Registrar elementos de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LineController,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ 
  title = "Evolución de Empresas por Año", 
  xAxisLabel = "Años", 
  yAxisLabel = "Cantidad de Empresas" 
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await empresasPorAnio(1825, 2025);
        
        // El endpoint devuelve { "empresasAnio": [...] }
        const empresasData = response.empresasAnio || [];
        
        // Ordenar los datos por año
        const sortedData = empresasData.sort((a, b) => a.anio - b.anio);
        
        setData(sortedData);
      } catch (error) {
        console.error('Error al obtener datos de timeline:', error);
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
      
      // Destruir instancia anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      // Preparar datos para el gráfico
      const labels = data.map(item => item.anio.toString());
      const values = data.map(item => item.total);

      // Crear gradiente para la línea
      const gradient = ctx.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, 'rgba(242, 158, 56, 0.8)');
      gradient.addColorStop(1, 'rgba(242, 158, 56, 0.1)');

      try {
        chartInstance.current = new ChartJS(ctx, {
          type: 'line',
          data: {
            labels: labels,
            datasets: [
              {
                label: 'Empresas Creadas',
                data: values,
                borderColor: '#F29E38',
                backgroundColor: gradient,
                borderWidth: 4,
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#072D42',
                pointBorderColor: '#FFFFFF',
                pointBorderWidth: 3,
                pointRadius: 6,
                pointHoverRadius: 10,
                pointHoverBackgroundColor: '#F29E38',
                pointHoverBorderColor: '#FFFFFF',
                pointHoverBorderWidth: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
              intersect: false,
              mode: 'index',
            },
            plugins: {
              legend: {
                position: 'top',
                labels: {
                  color: '#072D42',
                  font: {
                    family: 'Inter',
                    size: 12,
                    weight: '600',
                  },
                  padding: 20,
                  usePointStyle: true,
                  pointStyle: 'circle',
                },
              },
              title: {
                display: true,
                text: title,
                color: '#072D42',
                font: {
                  family: 'Plus Jakarta Sans',
                  size: 18,
                  weight: '700',
                },
                padding: {
                  bottom: 30,
                },
              },
              tooltip: {
                backgroundColor: 'rgba(7, 45, 66, 0.95)',
                titleColor: '#F4E9D7',
                bodyColor: '#F4E9D7',
                borderColor: '#F29E38',
                borderWidth: 2,
                cornerRadius: 8,
                displayColors: true,
                usePointStyle: true,
                callbacks: {
                  title: (context) => {
                    return `Año: ${context[0].label}`;
                  },
                  label: (context) => {
                    return `Empresas: ${context.parsed.y}`;
                  },
                  afterLabel: (context) => {
                    const totalEmpresas = data.reduce((sum, item) => sum + item.total, 0);
                    const porcentaje = ((context.parsed.y / totalEmpresas) * 100).toFixed(1);
                    return `Porcentaje: ${porcentaje}%`;
                  }
                },
                padding: 12,
                bodyFont: {
                  family: 'Inter',
                  size: 12,
                },
                titleFont: {
                  family: 'Plus Jakarta Sans',
                  size: 14,
                  weight: '600',
                },
              },
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(70, 78, 89, 0.1)',
                  drawBorder: false,
                },
                ticks: {
                  color: '#464E59',
                  font: {
                    family: 'Inter',
                    size: 11,
                  },
                  maxRotation: 45,
                  minRotation: 45,
                },
                title: {
                  display: true,
                  text: xAxisLabel,
                  color: '#072D42',
                  font: {
                    family: 'Inter',
                    size: 12,
                    weight: '600',
                  },
                  padding: {
                    top: 10,
                  },
                },
              },
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(70, 78, 89, 0.1)',
                  drawBorder: false,
                },
                ticks: {
                  color: '#464E59',
                  font: {
                    family: 'Inter',
                    size: 11,
                  },
                  precision: 0,
                },
                title: {
                  display: true,
                  text: yAxisLabel,
                  color: '#072D42',
                  font: {
                    family: 'Inter',
                    size: 12,
                    weight: '600',
                  },
                  padding: {
                    bottom: 10,
                  },
                },
              },
            },
            elements: {
              line: {
                tension: 0.4,
              },
            },
            animation: {
              duration: 2000,
              easing: 'easeOutQuart',
            },
            hover: {
              animationDuration: 300,
            },
          },
        });
      } catch (chartError) {
        console.error('Error al crear el gráfico:', chartError);
        setError('Error al crear el gráfico');
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, loading, title, xAxisLabel, yAxisLabel]);

  // Calcular estadísticas para mostrar
  const stats = React.useMemo(() => {
    if (data.length === 0) return null;
    
    const totalEmpresas = data.reduce((sum, item) => sum + item.total, 0);
    const añosConEmpresas = data.length;
    const añoMasAntiguo = Math.min(...data.map(item => item.anio));
    const añoMasReciente = Math.max(...data.map(item => item.anio));
    const añoConMasEmpresas = data.reduce((max, item) => 
      item.total > max.total ? item : max, data[0]
    );

    return {
      totalEmpresas,
      añosConEmpresas,
      añoMasAntiguo,
      añoMasReciente,
      añoConMasEmpresas: añoConMasEmpresas.anio,
      maxEmpresas: añoConMasEmpresas.total
    };
  }, [data]);

  if (loading) {
    return (
      <div className="chart-loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando datos históricos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart-error-container">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar el gráfico</h3>
        <p>{error}</p>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="chart-empty-container">
        <div className="empty-icon">📊</div>
        <h3>No hay datos disponibles</h3>
        <p>No se encontraron datos de empresas para el período seleccionado.</p>
      </div>
    );
  }

  return (
    <div className="line-chart-container">
      {/* Estadísticas rápidas */}
      {stats && (
        <div className="chart-stats">
          <div className="stat-item">
            <span className="stat-label">Total Empresas:</span>
            <span className="stat-value">{stats.totalEmpresas}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Período:</span>
            <span className="stat-value">{stats.añoMasAntiguo} - {stats.añoMasReciente}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Años con datos:</span>
            <span className="stat-value">{stats.añosConEmpresas}</span>
          </div>
          <div className="stat-item highlight">
            <span className="stat-label">Año pico:</span>
            <span className="stat-value">{stats.añoConMasEmpresas} ({stats.maxEmpresas} empresas)</span>
          </div>
        </div>
      )}
      
      {/* Gráfico principal */}
      <div className="chart-wrapper">
        <canvas ref={chartRef} />
      </div>
      
    </div>
  );
};

export default LineChart;