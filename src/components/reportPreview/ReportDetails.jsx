import React from 'react';

export default function ReportDetails({ building = 'Municipal Community Hall', id = 'RIN-2026-0483', engineer }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const displayEngineer = engineer || user?.fullName || user?.username || 'Guest';

  return (
    <div className="report-section">
      <h4>BUILDING INFORMATION</h4>
      <div className="review-grid">
        <div className="summary-item">
          <small>Building</small>
          <b>{building}</b>
        </div>
        <div className="summary-item">
          <small>Assessment ID</small>
          <b>{id}</b>
        </div>
        <div className="summary-item">
          <small>Engineer</small>
          <b>{displayEngineer}</b>
        </div>
      </div>
    </div>
  );
}
