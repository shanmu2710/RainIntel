import React from 'react';
import SearchInput from '../common/SearchInput';
import Button from '../common/Button';

export default function GisFilters({
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
        placeholder="Find a building or assessment"
        value={searchQuery}
        onChange={onSearchChange}
      />
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
        onClick={onStatusClick}
      >
        Status: {statusFilter || 'All'}
      </Button>
    </div>
  );
}
