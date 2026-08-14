import React from 'react';
import Card from '../common/Card';
import ReportStatus from './ReportStatus';
import ReportActions from './ReportActions';

export default function ReportTable({ reports, onReportSelect }) {
  return (
    <Card className="table-card">
      <div className="card-title">
        <div>
          <h3>Report register</h3>
          <p>1,284 reports in your workspace</p>
        </div>
      </div>
      <table className="report-table">
        <thead>
          <tr>
            <th>REPORT ID</th>
            <th>BUILDING</th>
            <th>ENGINEER</th>
            <th>DATE</th>
            <th>STATUS</th>
            <th>HARVEST POTENTIAL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, index) => (
            <tr key={index}>
              <td>
                <b>{r.id}</b>
              </td>
              <td>
                <b>{r.building}</b>
              </td>
              <td>{r.engineer}</td>
              <td>{r.date}</td>
              <td>
                <ReportStatus status={r.status} />
              </td>
              <td>
                <b>{r.potential}</b>
              </td>
              <td>
                <ReportActions onClick={() => onReportSelect && onReportSelect(r)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
