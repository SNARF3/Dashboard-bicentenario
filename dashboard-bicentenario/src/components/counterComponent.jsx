// components/CounterGrid.jsx
import React from 'react';
import StatCard from './StatCard';

const CounterGrid = ({ 
  data, 
  title, 
  className = '',
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className={`counter-grid ${className}`}>
        <h2>{title}</h2>
        <div className="grid">
          {[1, 2, 3, 4].map(i => (
            <StatCard
              key={i}
              title="Cargando..."
              value="0"
              isLoading={true}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`counter-grid ${className}`}>
      <h2>{title}</h2>
      <div className="grid">
        {data.map((item, index) => (
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