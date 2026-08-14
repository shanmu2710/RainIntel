import React from 'react';

export default function ReportSummary({ district = 'Vijayawada District' }) {
  return (
    <>
      <div className="report-logo">
        Rain<span>Intel</span>
      </div>
      <h2>
        ROOFTOP RAINWATER HARVESTING
        <br />
        ASSESSMENT REPORT
      </h2>
      <p style={{ textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
        Prepared under Jal Shakti Mission — {district}
      </p>
    </>
  );
}
