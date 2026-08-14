import React from 'react';

export default function ReportMetrics({ potential = '118,400 litres' }) {
  const heights = ['35px', '58px', '44px', '66px', '48px', '69px', '61px'];

  return (
    <div className="report-section">
      <h4>WATER POTENTIAL ANALYSIS</h4>
      <div className="mini-bars">
        {heights.map((height, idx) => (
          <i key={idx} style={{ height }}></i>
        ))}
      </div>
      <p style={{ fontSize: '12px', color: '#64748b' }}>
        Projected annual harvest potential:{' '}
        <b style={{ color: '#0f172a' }}>{potential}</b>
      </p>
    </div>
  );
}
