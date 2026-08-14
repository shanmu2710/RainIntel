import React from 'react';

export default function StatusBadge({ status, className = '', ...props }) {
  const getStatusClass = (val) => {
    if (!val) return 'neutral';
    const lower = val.toLowerCase();
    if (lower === 'completed' || lower === 'done') return 'done';
    if (lower === 'in review' || lower === 'review') return 'review';
    if (lower === 'processing') return 'progress-status';
    if (lower === 'draft' || lower === 'neutral') return 'neutral';
    return lower; // fallback to the value as a class name
  };

  const statusClass = getStatusClass(status);

  return (
    <span className={`status ${statusClass} ${className}`.trim()} {...props}>
      {status}
    </span>
  );
}
