import React from 'react';
import Card from '../common/Card';
import LucideIcon from '../common/LucideIcon';

export default function AssessmentTrendChart() {
  return (
    <Card className="assessment-trend">
      <div className="card-title">
        <div>
          <h3>Assessment volume</h3>
          <p>Monthly field surveys completed</p>
        </div>
      </div>
      <div style={{ display: 'grid', placeItems: 'center', height: '140px', color: '#64748b', textAlign: 'center', fontSize: '12px', background: '#f8fafc', borderRadius: '8px', marginTop: '12px', border: '1px solid #f1f5f9' }}>
        <div>
          <LucideIcon name="bar-chart" style={{ marginBottom: '8px', opacity: 0.5, width: '20px', height: '20px' }} />
          <p>No historical volume data available.</p>
        </div>
      </div>
    </Card>
  );
}
