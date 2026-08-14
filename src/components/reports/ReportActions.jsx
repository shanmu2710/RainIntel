import React from 'react';
import LucideIcon from '../common/LucideIcon';

export default function ReportActions({ onClick }) {
  return (
    <button className="table-btn" type="button" onClick={onClick}>
      <LucideIcon name="file-text" />
    </button>
  );
}
