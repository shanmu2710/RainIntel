import React from 'react';

export default function GisLegend() {
  const legendItems = [
    { label: 'Completed', color: '#0f766e' },
    { label: 'In Review', color: '#2563eb' },
    { label: 'Processing', color: '#f59e0b' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '15px',
        right: '15px',
        zIndex: 2,
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '9px',
        padding: '12px 14px',
        width: '160px',
        boxShadow: '0 8px 20px #0f172a17',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      <h4 style={{ fontSize: '11px', fontWeight: '600', margin: '0 0 8px', color: '#0f172a' }}>
        ASSESSMENT STATUS
      </h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '6px' }}>
        {legendItems.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#475569' }}>
            <span
              style={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: item.color
              }}
            />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
