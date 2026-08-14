import React from 'react';
import Card from '../common/Card';

export default function AssessmentMetrics({ metrics }) {
  const defaultMetrics = [
    { label: 'Annual rainfall', value: '1,108 mm' },
    { label: 'Harvest potential', value: '118,400 L' },
    { label: 'Recharge potential', value: '47,360 L' },
    { label: 'Storage capacity', value: '15,000 L' },
    { label: 'Estimated cost', value: '₹ 1.82 L' },
    { label: 'Payback period', value: '3.8 years' },
  ];

  const items = metrics || defaultMetrics;

  return (
    <div className="result-grid">
      {items.map((m, index) => (
        <Card key={index} className="summary-item">
          <small>{m.label}</small>
          <b style={{ font: '600 20px Poppins' }}>{m.value}</b>
        </Card>
      ))}
    </div>
  );
}
