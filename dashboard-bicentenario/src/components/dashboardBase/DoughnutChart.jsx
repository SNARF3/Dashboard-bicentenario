// components/dashboardBase/DoughnutChart.jsx
import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  DoughnutController,
  Legend,
} from 'chart.js';
import { conCompromisoODS } from '../../services/dashboardBaseService';
import '../../css/dashboardBase.css';

// Registrar los elementos necesarios para el gráfico de dona
ChartJS.register(
  ArcElement,
  Title,
  Tooltip,
  DoughnutController,
  Legend
);

const DoughnutChart = ({ type = "ods" }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const odsData = await conCompromisoODS();
        console.log('Datos recibidos del endpoint ODS:', odsData); // Para debug
        
        let normalizedData = [];
        if (type === "export") {
          // Para exportadoras (si existe este endpoint)
          normalizedData = [
            { label: 'Exportadoras', value: odsData.exportadoras || 0 },
            { label: 'No Exportadoras', value: odsData.noExportadoras || 0 },
          ];
        } else if (type === "ods") {
          // Para ODS - usando las propiedades correctas del endpoint
          normalizedData = [
            { label: 'Con Acciones ODS', value: odsData.conAcciones || 0 },
            { label: 'Sin Acciones ODS', value: odsData.sinAcciones || 0 },
          ];
        }
        
        console.log('Datos normalizados:', normalizedData); // Para debug
        setData(normalizedData);
      } catch (error) {
        console.error('Error al obtener datos de ODS:', error);
        setError('Error al cargar datos del gráfico');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  useEffect(() => {
    if (chartRef.current && data.length > 0 && !loading) {
      const ctx = chartRef.current.getContext('2d');
      
      // Destruir instancia anterior si existe
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const backgroundColors = [
        '#F29E38', // Naranja
        '#072D42', // Azul oscuro
        '#BFAEA4', // Beige
        '#464E59', // Gris oscuro
      ];

      // Calcular porcentajes para tooltips
      const total = data.reduce((sum, item) => sum + item.value, 0);

      // Crear nueva instancia del gráfico
      chartInstance.current = new ChartJS(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(item => item.label),
          datasets: [
            {
              data: data.map(item => item.value),
              backgroundColor: backgroundColors.slice(0, data.length),
              borderColor: '#FFFFFF',
              borderWidth: 3,
              borderRadius: 8,
              spacing: 2,
              hoverOffset: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#072D42',
                font: {
                  family: 'Inter',
                  size: 12,
                  weight: '500',
                },
                padding: 15,
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 8,
              },
            },
            title: {
              display: false, // Quitamos el título interno
            },
            tooltip: {
              backgroundColor: 'rgba(7, 45, 66, 0.95)',
              titleColor: '#F4E9D7',
              bodyColor: '#F4E9D7',
              borderColor: '#F29E38',
              borderWidth: 1,
              cornerRadius: 6,
              displayColors: true,
              usePointStyle: true,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `${label}: ${value} (${percentage}%)`;
                }
              },
              padding: 10,
              bodyFont: {
                family: 'Inter',
                size: 12,
              },
            },
          },
          animation: {
            animateScale: true,
            animateRotate: true,
            duration: 1000,
            easing: 'easeOutQuart',
          },
          hover: {
            animationDuration: 300,
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, loading]);

  // Calcular estadísticas
  const stats = React.useMemo(() => {
    if (data.length === 0) return null;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    const primaryItem = data[0];
    const secondaryItem = data[1];
    
    return {
      total,
      primaryValue: primaryItem?.value || 0,
      primaryPercentage: total > 0 ? ((primaryItem?.value / total) * 100).toFixed(1) : 0,
      secondaryValue: secondaryItem?.value || 0,
      secondaryPercentage: total > 0 ? ((secondaryItem?.value / total) * 100).toFixed(1) : 0,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="doughnut-loading">
        <div className="loading-spinner"></div>
        <p>Cargando datos de ODS...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="doughnut-error">
        <div className="error-icon">⚠️</div>
        <h3>Error al cargar el gráfico</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0 || data.every(item => item.value === 0)) {
    return (
      <div className="doughnut-empty">
        <div className="empty-icon">📊</div>
        <h3>No hay datos disponibles</h3>
        <p>No se encontraron datos para mostrar.</p>
      </div>
    );
  }

  return (
    <div className="doughnut-chart-container">
      {/* Estadísticas rápidas */}
      {stats && (
        <div className="doughnut-stats">
          <div className="stat-total">
            <span className="stat-label">Total Empresas:</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="stat-breakdown">
            <div className="breakdown-item">
              <div className="color-dot" style={{backgroundColor: '#F29E38'}}></div>
              <span className="breakdown-label">{data[0]?.label}:</span>
              <span className="breakdown-value">{stats.primaryValue} ({stats.primaryPercentage}%)</span>
            </div>
            <div className="breakdown-item">
              <div className="color-dot" style={{backgroundColor: '#072D42'}}></div>
              <span className="breakdown-label">{data[1]?.label}:</span>
              <span className="breakdown-value">{stats.secondaryValue} ({stats.secondaryPercentage}%)</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Gráfico principal */}
      <div className="doughnut-wrapper">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
};

export default DoughnutChart;