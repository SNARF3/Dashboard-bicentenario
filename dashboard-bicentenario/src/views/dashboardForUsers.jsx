// views/dashboardForUsers.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  LineController,
  DoughnutController,
  RadialLinearScale,
  RadarController
} from 'chart.js';
import datos from '../assets/empresas_50_estructura.json';
import '../css/dashboardForUsers.css';

// Registrar todos los elementos necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadialLinearScale,
  RadarController,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  LineController,
  DoughnutController
);

// Componente de Filtros
const FilterPanel = ({ filters, onFilterChange, data }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const uniqueValues = useMemo(() => {
    return {
      rubros: [...new Set(data.empresas.map(e => e.rubro))],
      tamanos: [...new Set(data.empresas.map(e => e.tamanoEmpresa))],
      tiposSocietarios: [...new Set(data.empresas.map(e => e.tipoSocietaria))],
      departamentos: [...new Set(data.empresas.flatMap(e => e.sedes.map(s => s.nombre)))],
      tieneODS: ['Con ODS', 'Sin ODS'],
      esFamiliar: ['Familiar', 'No Familiar'],
      operaInternacional: ['Internacional', 'Nacional']
    };
  }, [data]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...localFilters,
      [filterType]: localFilters[filterType].includes(value) 
        ? localFilters[filterType].filter(item => item !== value)
        : [...localFilters[filterType], value]
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      rubros: [],
      tamanos: [],
      tiposSocietarios: [],
      departamentos: [],
      tieneODS: [],
      esFamiliar: [],
      operaInternacional: []
    };
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const activeFiltersCount = Object.values(localFilters).reduce((count, filterArray) => 
    count + filterArray.length, 0
  );

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>🔍 Filtros Avanzados</h3>
        <div className="filter-controls">
          <span className="active-filters">{activeFiltersCount} activos</span>
          <button onClick={clearFilters} className="clear-filters-btn">
            Limpiar Todo
          </button>
        </div>
      </div>

      {Object.entries(uniqueValues).map(([key, values]) => (
        <div key={key} className="filter-group">
          <h4>{getFilterTitle(key)}</h4>
          <div className="filter-options">
            {values.map(value => (
              <label key={value} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={localFilters[key].includes(value)}
                  onChange={() => handleFilterChange(key, value)}
                />
                <span className="checkmark"></span>
                {value}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const getFilterTitle = (filterKey) => {
  const titles = {
    rubros: '📊 Rubro Económico',
    tamanos: '🏢 Tamaño Empresa',
    tiposSocietarios: '🏛️ Tipo Societario',
    departamentos: '📍 Departamento',
    tieneODS: '🌱 Compromiso ODS',
    esFamiliar: '👨‍👩‍👧‍👦 Empresa Familiar',
    operaInternacional: '🌎 Operaciones'
  };
  return titles[filterKey] || filterKey;
};

// Componente de KPI Cards
const KPICards = ({ filteredData }) => {
  const kpis = useMemo(() => {
    const empresas = filteredData.empresas;
    const totalEmpresas = empresas.length;
    if (totalEmpresas === 0) return {};
    
    const empresasConODS = empresas.filter(e => e.ods.length > 0).length;
    const empresasInternacionales = empresas.filter(e => e.operacionesInternacionales).length;
    const empresasFamiliares = empresas.filter(e => e.empresaFamiliar).length;
    const empresasSostenibles = empresas.filter(e => e.sostenibilidad).length;
    const empresasConImpacto = empresas.filter(e => e.impactoSocial).length;
    
    const añoActual = new Date().getFullYear();
    const antiguedadPromedio = añoActual - (
      empresas.reduce((sum, e) => sum + new Date(e.fechaFundacion).getFullYear(), 0) / totalEmpresas
    );

    // KPIs adicionales
    const totalODS = empresas.reduce((sum, e) => sum + e.ods.length, 0);
    const promedioODSPorEmpresa = (totalODS / empresasConODS).toFixed(1);
    const empresasConCambios = empresas.filter(e => e.cambioRubro || e.cambioTipoSocietario).length;

    return {
      totalEmpresas,
      empresasConODS,
      empresasInternacionales,
      empresasFamiliares,
      empresasSostenibles,
      empresasConImpacto,
      promedioSedes: (empresas.reduce((sum, e) => sum + e.sedes.length, 0) / totalEmpresas).toFixed(1),
      antiguedadPromedio: antiguedadPromedio.toFixed(1),
      tasaODS: ((empresasConODS / totalEmpresas) * 100).toFixed(1),
      tasaInternacional: ((empresasInternacionales / totalEmpresas) * 100).toFixed(1),
      promedioODSPorEmpresa,
      empresasConCambios,
      tasaImpacto: ((empresasConImpacto / totalEmpresas) * 100).toFixed(1)
    };
  }, [filteredData]);

  if (Object.keys(kpis).length === 0) {
    return (
      <div className="kpi-grid">
        <div className="kpi-card no-data">
          <div className="kpi-icon">📊</div>
          <div className="kpi-content">
            <h3>Sin Datos</h3>
            <div className="kpi-value">0</div>
            <div className="kpi-subtext">No hay empresas que coincidan con los filtros</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="kpi-grid">
      <div className="kpi-card highlight">
        <div className="kpi-icon">🏢</div>
        <div className="kpi-content">
          <h3>Total Empresas</h3>
          <div className="kpi-value">{kpis.totalEmpresas}</div>
          <div className="kpi-subtext">Ecosistema analizado</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">🌱</div>
        <div className="kpi-content">
          <h3>Compromiso ODS</h3>
          <div className="kpi-value">{kpis.empresasConODS}</div>
          <div className="kpi-subtext">{kpis.tasaODS}% del total</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">🌎</div>
        <div className="kpi-content">
          <h3>Internacionales</h3>
          <div className="kpi-value">{kpis.empresasInternacionales}</div>
          <div className="kpi-subtext">{kpis.tasaInternacional}% exportan</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">👨‍👩‍👧‍👦</div>
        <div className="kpi-content">
          <h3>Empresas Familiares</h3>
          <div className="kpi-value">{kpis.empresasFamiliares}</div>
          <div className="kpi-subtext">Tradición empresarial</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">🏛️</div>
        <div className="kpi-content">
          <h3>Promedio Sedes</h3>
          <div className="kpi-value">{kpis.promedioSedes}</div>
          <div className="kpi-subtext">Presencia nacional</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">♻️</div>
        <div className="kpi-content">
          <h3>Sostenibles</h3>
          <div className="kpi-value">{kpis.empresasSostenibles}</div>
          <div className="kpi-subtext">Prácticas ecológicas</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">📅</div>
        <div className="kpi-content">
          <h3>Antigüedad Prom.</h3>
          <div className="kpi-value">{kpis.antiguedadPromedio} años</div>
          <div className="kpi-subtext">Experiencia acumulada</div>
        </div>
      </div>

      {/* Nuevos KPIs */}
      <div className="kpi-card">
        <div className="kpi-icon">🎯</div>
        <div className="kpi-content">
          <h3>Impacto Social</h3>
          <div className="kpi-value">{kpis.empresasConImpacto}</div>
          <div className="kpi-subtext">{kpis.tasaImpacto}% del total</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">🔄</div>
        <div className="kpi-content">
          <h3>Empresas Flexibles</h3>
          <div className="kpi-value">{kpis.empresasConCambios}</div>
          <div className="kpi-subtext">Adaptación estratégica</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">📈</div>
        <div className="kpi-content">
          <h3>ODS/Empresa</h3>
          <div className="kpi-value">{kpis.promedioODSPorEmpresa}</div>
          <div className="kpi-subtext">Compromiso promedio</div>
        </div>
      </div>
    </div>
  );
};

// Gráfico de Distribución por Rubro
const RubroChart = ({ filteredData }) => {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  const data = useMemo(() => {
    const rubrosCount = filteredData.empresas.reduce((acc, empresa) => {
      acc[empresa.rubro] = (acc[empresa.rubro] || 0) + 1;
      return acc;
    }, {});

    const backgroundColors = [
      '#F29E38', '#072D42', '#BFAEA4', '#464E59', 
      '#9298A6', '#D9CBBF', '#8B4513', '#2F4F4F'
    ];

    return {
      labels: Object.keys(rubrosCount),
      datasets: [
        {
          label: 'Empresas por Rubro',
          data: Object.values(rubrosCount),
          backgroundColor: backgroundColors.slice(0, Object.keys(rubrosCount).length),
          borderWidth: 2,
          borderColor: '#FFFFFF'
        }
      ]
    };
  }, [filteredData]);

  useEffect(() => {
    if (chartRef.current && data.labels.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new ChartJS(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            title: {
              display: true,
              text: 'Distribución por Rubro Económico',
              color: '#072D42',
              font: {
                family: 'Plus Jakarta Sans',
                size: 16,
                weight: '600'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(7, 45, 66, 0.95)',
              titleColor: '#F4E9D7',
              bodyColor: '#F4E9D7',
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              },
              grid: {
                color: 'rgba(70, 78, 89, 0.1)'
              }
            },
            x: {
              grid: {
                color: 'rgba(70, 78, 89, 0.1)'
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="no-data-chart">
          <div className="no-data-icon">📊</div>
          <p>No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
};

// Gráfico de ODS por Tamaño
const ODSBySizeChart = ({ filteredData }) => {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  const data = useMemo(() => {
    const tamanos = ['Micro', 'Pequeña', 'Mediana', 'Grande'];
    const result = {};

    tamanos.forEach(tamano => {
      const empresasTamano = filteredData.empresas.filter(e => e.tamanoEmpresa === tamano);
      result[tamano] = {
        total: empresasTamano.length,
        conODS: empresasTamano.filter(e => e.ods.length > 0).length
      };
    });

    return {
      labels: tamanos,
      datasets: [
        {
          label: 'Con ODS',
          data: tamanos.map(t => result[t].conODS),
          backgroundColor: '#F29E38'
        },
        {
          label: 'Sin ODS',
          data: tamanos.map(t => result[t].total - result[t].conODS),
          backgroundColor: '#464E59'
        }
      ]
    };
  }, [filteredData]);

  useEffect(() => {
    if (chartRef.current && data.labels.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new ChartJS(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Compromiso ODS por Tamaño de Empresa',
              color: '#072D42',
              font: {
                family: 'Plus Jakarta Sans',
                size: 16,
                weight: '600'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(7, 45, 66, 0.95)',
              titleColor: '#F4E9D7',
              bodyColor: '#F4E9D7',
            }
          },
          scales: {
            x: {
              stacked: true,
              grid: {
                color: 'rgba(70, 78, 89, 0.1)'
              }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: {
                precision: 0
              },
              grid: {
                color: 'rgba(70, 78, 89, 0.1)'
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="no-data-chart">
          <div className="no-data-icon">📊</div>
          <p>No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
};

// Gráfico de Evolución Temporal
const TimelineChart = ({ filteredData }) => {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  const data = useMemo(() => {
    const empresasPorAño = filteredData.empresas.reduce((acc, empresa) => {
      const año = new Date(empresa.fechaFundacion).getFullYear();
      const decada = Math.floor(año / 10) * 10;
      acc[decada] = (acc[decada] || 0) + 1;
      return acc;
    }, {});

    // Ordenar por década
    const sortedEntries = Object.entries(empresasPorAño).sort((a, b) => parseInt(a[0]) - parseInt(b[0]));

    return {
      labels: sortedEntries.map(([decada]) => `${decada}s`),
      datasets: [
        {
          label: 'Empresas Fundadas',
          data: sortedEntries.map(([, count]) => count),
          borderColor: '#F29E38',
          backgroundColor: 'rgba(242, 158, 56, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true
        }
      ]
    };
  }, [filteredData]);

  useEffect(() => {
    if (chartRef.current && data.labels.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new ChartJS(ctx, {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Evolución de Creación de Empresas',
              color: '#072D42',
              font: {
                family: 'Plus Jakarta Sans',
                size: 16,
                weight: '600'
              }
            },
            tooltip: {
              backgroundColor: 'rgba(7, 45, 66, 0.95)',
              titleColor: '#F4E9D7',
              bodyColor: '#F4E9D7',
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0
              },
              grid: {
                color: 'rgba(70, 78, 89, 0.1)'
              }
            },
            x: {
              grid: {
                color: 'rgba(70, 78, 89, 0.1)'
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="no-data-chart">
          <div className="no-data-icon">📊</div>
          <p>No hay datos para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
};



// NUEVO: Gráfico de Radar - Perfil Empresarial Promedio
const RadarChart = ({ filteredData }) => {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  const data = useMemo(() => {
    const empresas = filteredData.empresas;
    const total = empresas.length;
    
    if (total === 0) return { labels: [], datasets: [] };

    const metrics = {
      'Internacionalización': (empresas.filter(e => e.operacionesInternacionales).length / total) * 100,
      'Sostenibilidad': (empresas.filter(e => e.sostenibilidad).length / total) * 100,
      'Impacto Social': (empresas.filter(e => e.impactoSocial).length / total) * 100,
      'Compromiso ODS': (empresas.filter(e => e.ods.length > 0).length / total) * 100,
      'Presencia Nacional': (empresas.reduce((sum, e) => sum + e.sedes.length, 0) / total) * 20, // Normalizado
      'Antigüedad': (empresas.reduce((sum, e) => {
        const años = new Date().getFullYear() - new Date(e.fechaFundacion).getFullYear();
        return sum + Math.min(años, 50); // Cap at 50 años
      }, 0) / total) * 2 // Normalizado
    };

    return {
      labels: Object.keys(metrics),
      datasets: [
        {
          label: 'Perfil Empresarial Promedio',
          data: Object.values(metrics),
          backgroundColor: 'rgba(242, 158, 56, 0.2)',
          borderColor: '#F29E38',
          pointBackgroundColor: '#072D42',
          pointBorderColor: '#FFFFFF',
          pointHoverBackgroundColor: '#F29E38',
          pointHoverBorderColor: '#072D42',
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    };
  }, [filteredData]);

  useEffect(() => {
    if (chartRef.current && data.labels.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new ChartJS(ctx, {
        type: 'radar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Perfil Empresarial Promedio',
              color: '#072D42',
              font: {
                family: 'Plus Jakarta Sans',
                size: 16,
                weight: '600'
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  return `${context.dataset.label}: ${context.raw.toFixed(1)}%`;
                }
              }
            }
          },
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: {
                backdropColor: 'transparent',
                color: '#464E59'
              },
              grid: {
                color: 'rgba(70, 78, 89, 0.1)'
              },
              angleLines: {
                color: 'rgba(70, 78, 89, 0.1)'
              },
              pointLabels: {
                color: '#072D42',
                font: {
                  family: 'Inter',
                  size: 11,
                  weight: '500'
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="no-data-chart">
          <div className="no-data-icon">📡</div>
          <p>No hay datos para el gráfico de radar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
};

// NUEVO: Gráfico de Dona - Distribución ODS
const ODSDistributionChart = ({ filteredData }) => {
  const chartRef = React.useRef(null);
  const chartInstance = React.useRef(null);

  const data = useMemo(() => {
    const odsCount = filteredData.empresas.reduce((acc, empresa) => {
      empresa.ods.forEach(ods => {
        acc[ods.nombre] = (acc[ods.nombre] || 0) + 1;
      });
      return acc;
    }, {});

    const sortedODS = Object.entries(odsCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8); // Top 8 ODS

    const backgroundColors = [
      '#F29E38', '#072D42', '#BFAEA4', '#464E59',
      '#9298A6', '#D9CBBF', '#8B4513', '#2F4F4F'
    ];

    return {
      labels: sortedODS.map(([ods]) => ods),
      datasets: [
        {
          data: sortedODS.map(([, count]) => count),
          backgroundColor: backgroundColors.slice(0, sortedODS.length),
          borderWidth: 2,
          borderColor: '#FFFFFF',
          hoverOffset: 15
        }
      ]
    };
  }, [filteredData]);

  useEffect(() => {
    if (chartRef.current && data.labels.length > 0) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new ChartJS(ctx, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '60%',
          plugins: {
            title: {
              display: true,
              text: 'Distribución de Objetivos ODS',
              color: '#072D42',
              font: {
                family: 'Plus Jakarta Sans',
                size: 16,
                weight: '600'
              }
            },
            legend: {
              position: 'bottom',
              labels: {
                color: '#072D42',
                font: {
                  family: 'Inter',
                  size: 11
                },
                padding: 15,
                usePointStyle: true
              }
            },
            tooltip: {
              callbacks: {
                label: (context) => {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                  return `${context.label}: ${context.parsed} (${percentage}%)`;
                }
              }
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (data.labels.length === 0) {
    return (
      <div className="chart-container">
        <div className="no-data-chart">
          <div className="no-data-icon">🎯</div>
          <p>No hay datos de ODS para mostrar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <canvas ref={chartRef} />
    </div>
  );
};

// Componente principal
const DashboardForUsers = () => {
  const [filters, setFilters] = useState({
    rubros: [],
    tamanos: [],
    tiposSocietarios: [],
    departamentos: [],
    tieneODS: [],
    esFamiliar: [],
    operaInternacional: []
  });

  const filteredData = useMemo(() => {
    let filtered = [...datos.empresas];

    // Aplicar filtros
    if (filters.rubros.length > 0) {
      filtered = filtered.filter(empresa => filters.rubros.includes(empresa.rubro));
    }

    if (filters.tamanos.length > 0) {
      filtered = filtered.filter(empresa => filters.tamanos.includes(empresa.tamanoEmpresa));
    }

    if (filters.tiposSocietarios.length > 0) {
      filtered = filtered.filter(empresa => filters.tiposSocietarios.includes(empresa.tipoSocietaria));
    }

    if (filters.departamentos.length > 0) {
      filtered = filtered.filter(empresa => 
        empresa.sedes.some(sede => filters.departamentos.includes(sede.nombre))
      );
    }

    if (filters.tieneODS.length > 0) {
      if (filters.tieneODS.includes('Con ODS')) {
        filtered = filtered.filter(empresa => empresa.ods.length > 0);
      }
      if (filters.tieneODS.includes('Sin ODS')) {
        filtered = filtered.filter(empresa => empresa.ods.length === 0);
      }
    }

    if (filters.esFamiliar.length > 0) {
      if (filters.esFamiliar.includes('Familiar')) {
        filtered = filtered.filter(empresa => empresa.empresaFamiliar);
      }
      if (filters.esFamiliar.includes('No Familiar')) {
        filtered = filtered.filter(empresa => !empresa.empresaFamiliar);
      }
    }

    if (filters.operaInternacional.length > 0) {
      if (filters.operaInternacional.includes('Internacional')) {
        filtered = filtered.filter(empresa => empresa.operacionesInternacionales);
      }
      if (filters.operaInternacional.includes('Nacional')) {
        filtered = filtered.filter(empresa => !empresa.operacionesInternacionales);
      }
    }

    return { empresas: filtered };
  }, [filters]);

  return (
    <div className="analytics-dashboard">
      <div className="analytics-container">
        <header className="analytics-header">
          <h1 className="analytics-title">🚀 Analytics Dashboard - PowerBI Style</h1>
          <p className="analytics-subtitle">
            Análisis cruzado en tiempo real del ecosistema empresarial boliviano
            {filteredData.empresas.length !== datos.empresas.length && 
              <span className="filter-count">
                ({filteredData.empresas.length} de {datos.empresas.length} empresas filtradas)
              </span>
            }
          </p>
        </header>

        <div className="analytics-layout">
          {/* Panel de Filtros */}
          <div className="filters-sidebar">
            <FilterPanel 
              filters={filters} 
              onFilterChange={setFilters}
              data={datos}
            />
          </div>

          {/* Contenido Principal */}
          <div className="analytics-content">
            {/* KPIs */}
            <div className="analytics-section">
              <KPICards filteredData={filteredData} />
            </div>

            {/* Primera fila de gráficos */}
            <div className="analytics-section">
              <div className="charts-grid">
                <div className="chart-block">
                  <RubroChart filteredData={filteredData} />
                </div>
                <div className="chart-block">
                  <ODSBySizeChart filteredData={filteredData} />
                </div>
                <div className="chart-block">
                  <ODSDistributionChart filteredData={filteredData} />
                </div>
                <div className="chart-block">
                  <RadarChart filteredData={filteredData} />
                </div>
              </div>
            </div>

            {/* Segunda fila de gráficos */}
            <div className="analytics-section">
              <div className="charts-grid">
                <div className="chart-block full-width">
                  <TimelineChart filteredData={filteredData} />
                </div>
              </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardForUsers;