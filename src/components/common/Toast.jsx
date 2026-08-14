import React from 'react';
import LucideIcon from './LucideIcon';

export default function Toast({
  message,
  show = false,
  icon = 'circle-check',
  className = '',
  ...props
}) {
  return (
    <div
      className={`toast ${show ? 'show' : ''} ${className}`.trim()}
      {...props}
    >
      <LucideIcon name={icon} />
      <span>{message}</span>
    </div>
  );
}
