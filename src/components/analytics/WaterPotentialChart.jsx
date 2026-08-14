import React from 'react';
import Card from '../common/Card';
import LucideIcon from '../common/LucideIcon';

export default function WaterPotentialChart() {
  return (
    <Card className="potential-chart">
      <div className="card-title">
        <div>
          <h3>Water Potential History</h3>
          <p>Monthly yield statistics</p>
        </div>
      </div>
      <div style={{ display: 'grid', placeItems: 'center', height: '140px', color: '#64748b', textAlign: 'center', fontSize: '12px', background: '#f8fafc', borderRadius: '8px', marginTop: '12px', border: '1px solid #f1f5f9' }}>
        <div>
          <LucideIcon name="pie-chart" style={{ marginBottom: '8px', opacity: 0.5, width: '20px', height: '20px' }} />
          <p>Chart data unavailable on backend.</p>
        </div>
      </div>
    </Card>
  );
}
