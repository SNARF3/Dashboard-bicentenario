// 1. Importa useState y useEffect
import React, { useState, useEffect, useRef } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiHome, FiSettings, FiBarChart, FiMap, FiUsers, FiMenu, FiX } from 'react-icons/fi';


// Importar el archivo CSS
import '../css/dashboardBase.css';

// Importar el nuevo componente BoliviaMap
import BoliviaMap, { sampleBoliviaData } from '../components/BoliviaMap';

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// Función para el bloque del Mapa Responsivo
const BoliviaMapBlock = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 300 }); // Inicia con los valores por defecto

  useEffect(() => {
    // 2. Función para medir el contenedor
    const updateDimensions = () => {
      if (containerRef.current) {
        // Obtenemos el ancho del contenedor padre (map-container)
        const parentWidth = containerRef.current.offsetWidth;
        const parentHeight = containerRef.current.offsetHeight;

        // Usamos una proporción (ej: 1.5:1) para el mapa
        const newWidth = parentWidth;
        // Asignamos una altura basada en el ancho para mantener la proporción, o simplemente usamos la altura del contenedor
        const newHeight = parentHeight > 0 ? parentHeight : Math.round(newWidth / 1.5);

        setDimensions({ width: newWidth, height: newHeight });
      }
    };

    // 3. Ejecutar al montar y en resize
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    // 4. Limpieza
    return () => window.removeEventListener('resize', updateDimensions);
  }, []); // Solo se ejecuta al montar y desmontar

  return (
    <div className="dashboard-block map-block">
      <h2>🗺️ Distribución Geográfica</h2>
      {/* 5. Asignamos la referencia (ref) al contenedor donde estará el mapa */}
      <div className="map-container" ref={containerRef}>
        <BoliviaMap
          data={sampleBoliviaData}
          title="Cantidad de Empresas por Departamento"
          // 6. Pasamos las dimensiones dinámicas
          width={dimensions.width}
          height={dimensions.height}
          colorRange={['#e3f2fd', '#1565c0']}
          defaultColor="#f5f5f5"
        />
      </div>
    </div>
  );
};

// ==================== COMPONENTE SIDEBAR ====================
const navItems = [
  { name: 'Dashboard', icon: FiHome, path: '/', isActive: true },
  { name: 'Reportes', icon: FiBarChart, path: '/reports', isActive: false },
  { name: 'Geografía', icon: FiMap, path: '/geo', isActive: false },
  { name: 'Usuarios', icon: FiUsers, path: '/users', isActive: false },
  { name: 'Configuración', icon: FiSettings, path: '/settings', isActive: false },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <span className="sidebar-logo" style={{color: 'var(--primary)'}}>BICENTENARIO</span>
                
                {/* ❌ 1. Botón de Cerrar/X para Móvil ❌ */}
                {/* Ahora este botón tendrá la clase 'close-sidebar-btn' que controlaremos con CSS. */}
                <button 
                    className="close-sidebar-btn" 
                    onClick={() => setIsOpen(false)}
                    title="Cerrar Menú"
                >
                    <FiX size={24} />
                </button>
            </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          // Usamos un simple div con className para simular la navegación activa
          <a
            key={item.name}
            href={item.path}
            className={`sidebar-item ${item.isActive ? 'active' : ''}`}
          >
            <item.icon className="sidebar-icon" />
            <span className="sidebar-text">{item.name}</span>
          </a>
        ))}
      </nav>
    </aside>
  );
};

// ==================== COMPONENTES BASE ====================
const StatCard = ({ title, value, unit = '', className = '' }) => (
  <div className={`stat-card ${className}`}>
    <h3>{title}</h3>
    <div className="stat-value">
      {value}{unit}
    </div>
  </div>
);

// ==================== COMPONENTES DE GRÁFICOS ====================
const LineChart = ({ data, title, xAxisLabel, yAxisLabel, className = '' }) => {
  const chartData = {
    labels: data.map(item => item.year || item.label),
    datasets: [{
      label: title,
      data: data.map(item => item.value),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      tension: 0.1,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title },
    },
    scales: {
      x: { title: { display: true, text: xAxisLabel } },
      y: { title: { display: true, text: yAxisLabel }, beginAtZero: true },
    },
  };

  return (
    <div className={`chart-container line-chart ${className}`}>
      <Line data={chartData} options={options} />
    </div>
  );
};

const BarChart = ({ data, title, xAxisLabel, yAxisLabel, horizontal = true, className = '' }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [{
      label: title,
      data: data.map(item => item.value),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const options = {
    indexAxis: horizontal ? 'y' : 'x',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title },
    },
    scales: {
      x: { title: { display: true, text: horizontal ? yAxisLabel : xAxisLabel }, beginAtZero: true },
      y: { title: { display: true, text: horizontal ? xAxisLabel : yAxisLabel } },
    },
  };

  return (
    <div className={`chart-container bar-chart ${className}`}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

const DoughnutChart = ({ data, title, colors = ['#FF6384', '#36A2EB'], className = '' }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [{
      data: data.map(item => item.value),
      backgroundColor: colors,
      borderColor: colors.map(color => color.replace('0.6', '1')),
      borderWidth: 1,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: title },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    cutout: '50%',
  };

  return (
    <div className={`chart-container doughnut-chart ${className}`}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

// ==================== BLOQUES DEL DASHBOARD ====================
const KPIBlock = ({ averageAge, averageOffices }) => (
  <div className="dashboard-block kpi-block">
    <h2>📊 Indicadores Clave</h2>
    <div className="kpi-grid">
      <div className="kpi-card">
        <h3>Promedio de Antigüedad</h3>
        <div className="stat-value">{averageAge} años</div>
      </div>
      <div className="kpi-card">
        <h3>Promedio de Sedes</h3>
        <div className="stat-value">{averageOffices}</div>
      </div>
    </div>
  </div>
);

const CompanySizeBlock = ({ data }) => (
  <div className="dashboard-block size-block">
    <h2>🏢 Distribución por Tamaño</h2>
    <div className="dashboard-grid-4cols">
      {data.map((item, index) => (
        <StatCard
          key={index}
          title={item.label}
          value={item.value}
          unit={item.unit}
        />
      ))}
    </div>
  </div>
);

const TimelineBlock = ({ data }) => (
  <div className="dashboard-block timeline-block">
    <h2>📈 Evolución Temporal</h2>
    <LineChart
      data={data}
      title="Empresas Creadas por Año"
      xAxisLabel="Años"
      yAxisLabel="Cantidad"
    />
  </div>
);

const SectorBlock = ({ data }) => (
  <div className="dashboard-block sector-block">
    <h2>🏭 Empresas por Sector Económico</h2>
    <BarChart
      data={data}
      title=""
      xAxisLabel="Sectores"
      yAxisLabel="Cantidad"
      horizontal={true}
    />
  </div>
);

const ExportBlock = ({ data }) => (
  <div className="dashboard-block export-block">
    <h2>🌎 Empresas Exportadoras</h2>
    <DoughnutChart
      data={data}
      title=""
      colors={['#4CAF50', '#F44336']}
    />
  </div>
);

const ODSBlock = ({ data }) => (
  <div className="dashboard-block ods-block">
    <h2>♻️ Compromiso ODS</h2>
    <DoughnutChart
      data={data}
      title=""
      colors={['#2196F3', '#FF9800']}
    />
  </div>
);

// ==================== DASHBOARD PRINCIPAL (MODIFICADO) ====================
const DashboardBase = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mockData = {
    // ... [TUS DATOS DE MOCK] ...
    kpi: { averageAge: 7.5, averageOffices: 2.3 },
    companySizes: [
      { label: 'Micro', value: 45, unit: '%' },
      { label: 'Pequeñas', value: 30, unit: '%' },
      { label: 'Medianas', value: 20, unit: '%' },
      { label: 'Grandes', value: 5, unit: '%' },
    ],
    timeline: [
      { year: '2020', value: 150 }, { year: '2021', value: 180 },
      { year: '2022', value: 210 }, { year: '2023', value: 190 },
      { year: '2024', value: 220 },
    ],
    sectors: [
      { label: 'Tecnología', value: 120 }, { label: 'Manufactura', value: 85 },
      { label: 'Servicios', value: 150 }, { label: 'Comercio', value: 95 },
      { label: 'Agricultura', value: 60 }, { label: 'Construcción', value: 75 },
    ],
    exports: [{ label: 'Exportadoras', value: 35 }, { label: 'No Exportadoras', value: 65 }],
    ods: [{ label: 'Con ODS', value: 40 }, { label: 'Sin ODS', value: 60 }],
    geographicDistribution: sampleBoliviaData
  };

  return (

    // Nuevo contenedor flex para la aplicación completa
    <div className="dashboard-app">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {/* Contenedor principal del dashboard (la parte que se desplaza) */}
      <div className="dashboard-base">

        {/* 3. Botón de Hamburguesa Fijo para Móviles */}
        <div className="mobile-header">
          <button
            className="menu-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {/* Cambia el icono según el estado */}
            {isSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <h1 className="mobile-title">BICENTENARIO</h1>
        </div>

        <header className="dashboard-header">
          <h1>📊 Dashboard de Estadísticas Empresariales</h1>
          <p>Panel de control integral para el análisis de datos empresariales</p>
        </header>

        <div className="dashboard-layout">
          {/* Fila 1: KPIs (ancho completo) */}
          <KPIBlock {...mockData.kpi} />

          {/* Fila 2: Tamaños de empresa (ancho completo) */}
          <CompanySizeBlock data={mockData.companySizes} />

          {/* Fila 3: Timeline y Sectores */}
          <div className="dashboard-row">
            <TimelineBlock data={mockData.timeline} />
            <SectorBlock data={mockData.sectors} />
          </div>

          {/* Fila 4: Exportadoras y ODS */}
          <div className="dashboard-row">
            <ExportBlock data={mockData.exports} />
            <ODSBlock data={mockData.ods} />
          </div>

          {/* Fila 5: Mapa de Bolivia (ancho completo) */}
          <div className="dashboard-row">
            <BoliviaMapBlock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBase;