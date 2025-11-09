// components/dashboard/Sidebar.jsx
import React from 'react';
import Icon from './Icon';
import '../../css/dashboardBase.css';

const Sidebar = () => (
  <div className="dashboard-sidebar">
    <div className="sidebar-header">
      <h1 className="sidebar-title">Bicentenario Analytics</h1>
    </div>
    <nav className="sidebar-nav">
      <a href="#" className="nav-link active">
        <Icon name="home" className="nav-icon" />
        <span>Inicio</span>
      </a>
      <a href="#" className="nav-link">
        <Icon name="statistics" className="nav-icon" />
        <span>Estadísticas</span>
      </a>
      <a href="#" className="nav-link">
        <Icon name="report" className="nav-icon" />
        <span>Reportes</span>
      </a>
      <a href="#" className="nav-link">
        <Icon name="settings" className="nav-icon" />
        <span>Configuración</span>
      </a>
    </nav>
  </div>
);

export default Sidebar;