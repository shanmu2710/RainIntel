import React from 'react';
import SearchInput from '../common/SearchInput';
import Button from '../common/Button';

export default function ReportFilters({
  searchQuery,
  onSearchChange,
  districtFilter,
  onDistrictClick,
  statusFilter,
  onStatusClick,
}) {
  return (
    <div className="filter-row">
      <SearchInput
        placeholder="Search reports"
        value={searchQuery}
        onChange={onSearchChange}
      />
      <Button
        variant="secondary"
        icon="chevron-down"
        iconPosition="right"
        onClick={onDistrictClick}
      >
        {districtFilter || 'All districts'}
      </Button>
      <Button
        variant="secondary"
        icon="chevron-down"
        iconPosition="right"
        onClick={onStatusClick}
      >
        {statusFilter || 'All status'}
      </Button>
    </div>
  );
}
