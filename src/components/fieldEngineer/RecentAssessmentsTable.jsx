import React from 'react';
import Card from '../common/Card';
import StatusBadge from '../common/StatusBadge';
import LucideIcon from '../common/LucideIcon';

export default function RecentAssessmentsTable({ assessments }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isFieldEngineer = user?.role === 'FIELD_ENGINEER';

  return (
    <Card className="assessments">
      <div className="card-title">
        <div>
          <h3>Recent assessments</h3>
          <p>{isFieldEngineer ? 'Recent Field Activity' : 'Latest activity across your district'}</p>
        </div>
        <a href="#" onClick={(e) => e.preventDefault()}>
          View all <LucideIcon name="arrow-up-right" />
        </a>
      </div>
      <table>
        <thead>
          <tr>
            <th>BUILDING</th>
            <th>STATUS</th>
            <th>WATER POTENTIAL</th>
            <th>DATE</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((a, index) => (
            <tr key={index}>
              <td>
                <span className={`building-icon ${a.iconColorClass || ''}`.trim()}>
                  <LucideIcon name={a.icon} />
                </span>
                <div>
                  <b>{a.buildingName}</b>
                  <small>{a.id}</small>
                </div>
              </td>
              <td>
                <StatusBadge status={a.status} />
              </td>
              <td>
                <b>{a.potential}</b>
              </td>
              <td>{a.date}</td>
              <td>
                <button className="table-btn">
                  <LucideIcon name="more-horizontal" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
