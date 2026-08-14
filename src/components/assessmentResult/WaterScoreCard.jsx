import React from 'react';
import Card from '../common/Card';

export default function WaterScoreCard({ score = 'A+', households = '16 households' }) {
  return (
    <Card>
      <h3 style={{ font: '600 15px Poppins', marginTop: 0 }}>Impact summary</h3>
      <div className="donut">
        <div>
          <b>{score}</b>
          <span>Water score</span>
        </div>
      </div>
      <p style={{ textAlign: 'center', color: '#64748b', fontSize: '11px' }}>
        Equivalent to annual water needs of<br />
        <b style={{ color: '#0f172a' }}>{households}</b>
      </p>
    </Card>
  );
}
