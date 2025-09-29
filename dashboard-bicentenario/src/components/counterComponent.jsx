// components/CounterGrid.jsx
import React from 'react';
import StatCard from './StatCard';

const CounterGrid = ({ 
  data, 
  title, 
  className = '',
  isLoading = false 
}) => {
  return (
    <div className={`counter-grid ${className}`} style={{ width: '100%' }}>
      <h2>{title}</h2>
      <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        {isLoading
          ? [1, 2, 3, 4].map(i => (
              <StatCard
                key={i}
                title="Cargando..."
                value="0"
                isLoading={true}
              />
            ))
          : data.map((item, index) => (
              <StatCard
                key={index}
                title={item.label}
                value={item.value}
                unit={item.unit || ''}
              />
            ))}
      </div>
    </div>
  );
};

export default CounterGrid;