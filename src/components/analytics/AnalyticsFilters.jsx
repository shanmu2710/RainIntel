import React from 'react';
import Button from '../common/Button';

export default function AnalyticsFilters({
  districtFilter,
  onDistrictClick,
  periodFilter,
  onPeriodClick,
}) {
  return (
    <div className="filter-row" style={{ marginBottom: '17px' }}>
      <Button
        variant="secondary"
        icon="chevron-down"
        iconPosition="right"
        onClick={onDistrictClick}
      >
        District: {districtFilter || 'Vijayawada'}
      </Button>
      <Button
        variant="secondary"
        icon="chevron-down"
        iconPosition="right"
        onClick={onPeriodClick}
      >
        Period: {periodFilter || 'This year'}
      </Button>
    </div>
  );
}
