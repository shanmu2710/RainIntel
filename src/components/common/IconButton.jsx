import React from 'react';
import LucideIcon from './LucideIcon';

export default function IconButton({
  icon,
  hasBadge = false,
  className = '',
  onClick,
  ...props
}) {
  return (
    <button
      type="button"
      className={`icon-btn ${className}`.trim()}
      onClick={onClick}
      {...props}
    >
      <LucideIcon name={icon} />
      {hasBadge && <em></em>}
    </button>
  );
}
