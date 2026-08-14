import React from 'react';
import StatusBadge from '../common/StatusBadge';

export default function GisSiteCard({ location }) {
  if (!location) return null;

  return (
    <div className="map-card">
      <b>{location.buildingName}</b>
      <p>{location.details}</p>
      <StatusBadge status={location.status} />
    </div>
  );
}
