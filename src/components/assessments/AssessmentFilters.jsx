import React from 'react';
import SearchInput from '../common/SearchInput';
import Button from '../common/Button';

export default function AssessmentFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusClick,
  timeFilter,
  onTimeClick,
}) {
  return (
    <div className="filter-row">
      <SearchInput
        placeholder="Search building, owner, or assessment ID"
        value={searchQuery}
        onChange={onSearchChange}
      />
      <Button
        variant="secondary"
        icon="chevron-down"
        iconPosition="right"
        onClick={onStatusClick}
      >
        {statusFilter || 'All statuses'}
      </Button>
      <Button
        variant="secondary"
        icon="calendar-days"
        iconPosition="right"
        onClick={onTimeClick}
      >
        {timeFilter || 'This month'}
      </Button>
    </div>
  );
}
