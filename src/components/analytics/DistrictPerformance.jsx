import React from 'react';
import Card from '../common/Card';
import LucideIcon from '../common/LucideIcon';

export default function DistrictPerformance() {
  const districts = [
    { name: 'Vijayawada', rate: '98%', colorClass: 'one' },
    { name: 'Guntur', rate: '95%', colorClass: 'two' },
    { name: 'Krishna', rate: '91%', colorClass: 'three' },
  ];

  return (
    <Card className="district">
      <div className="card-title">
        <div>
          <h3>District performance</h3>
          <p>Assessment completion</p>
        </div>
        <button className="dots" type="button">
          <LucideIcon name="ellipsis" />
        </button>
      </div>
      <div className="donut">
        <div>
          <b>94%</b>
          <span>Average</span>
        </div>
      </div>
      <ul className="district-list">
        {districts.map((d, index) => (
          <li key={index}>
            <span>
              <b className={`dot ${d.colorClass}`}></b>
              {d.name}
            </span>
            <strong>{d.rate}</strong>
          </li>
        ))}
      </ul>
    </Card>
  );
}
