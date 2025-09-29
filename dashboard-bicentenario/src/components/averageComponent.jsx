// components/StatCard.jsx
import React from 'react';

const StatCard = ({ 
  title, 
  value, 
  unit = '', 
  className = '',
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className={`stat-card loading ${className}`} style={{ width: '100%', height: '100%' }}>
        <h3>{title}</h3>
        <div className="skeleton-loader"></div>
      </div>
    );
  }

  return (
    <div className={`stat-card ${className}`} style={{ width: '100%', height: '100%' }}>
      <h3>{title}</h3>
      <div className="stat-value">
        {value}{unit}
      </div>
    </div>
  );
};

export default StatCard;