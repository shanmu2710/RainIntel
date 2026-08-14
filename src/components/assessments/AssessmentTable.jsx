import React from 'react';
import Card from '../common/Card';
import AssessmentStatus from './AssessmentStatus';

export default function AssessmentTable({ assessments, onRowClick }) {
  return (
    <Card className="table-card">
      <table>
        <thead>
          <tr>
            <th>ASSESSMENT</th>
            <th>ENGINEER</th>
            <th>STATUS</th>
            <th>ROOF AREA</th>
            <th>WATER POTENTIAL</th>
            <th>UPDATED</th>
          </tr>
        </thead>
        <tbody>
          {assessments.map((a, index) => (
            <tr
              key={index}
              style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              onClick={() => onRowClick && onRowClick(a)}
            >
              <td>
                <b>{a.building}</b>
                <small>{a.id}</small>
              </td>
              <td>{a.engineer}</td>
              <td>
                <AssessmentStatus status={a.status} />
              </td>
              <td>{a.roofArea}</td>
              <td>
                <b>{a.potential}</b>
              </td>
              <td>{a.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
