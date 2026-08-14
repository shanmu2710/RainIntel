import React from 'react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';

export default function RecommendationCard({ recommendations, confidence = '96%' }) {
  const defaultRecs = [
    { label: 'System', value: 'Hybrid storage + recharge' },
    { label: 'Storage tank', value: '15,000 L HDPE tank' },
    { label: 'Recharge pit', value: '2.4 m x 2.4 m x 2.5 m' },
    { label: 'Filter', value: 'Dual media rainwater filter' },
    { label: 'Maintenance', value: 'Biannual cleaning' },
    { label: 'Environmental impact', value: '47,360 L recharge / year' },
  ];

  const list = recommendations || defaultRecs;

  return (
    <Card>
      <div className="card-title">
        <div>
          <h3>Engineered recommendation</h3>
          <p>Optimised for this rooftop and local hydrogeology.</p>
        </div>
        <StatusBadge status={`${confidence} confidence`} />
      </div>
      <div className="review-grid" style={{ marginTop: '20px' }}>
        {list.map((r, index) => (
          <div key={index} className="summary-item">
            <small>{r.label}</small>
            <b>{r.value}</b>
          </div>
        ))}
      </div>
    </Card>
  );
}
