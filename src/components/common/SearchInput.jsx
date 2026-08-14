import React from 'react';
import LucideIcon from './LucideIcon';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  ...props
}) {
  return (
    <label className={`search ${className}`.trim()}>
      <LucideIcon name="search" />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </label>
  );
}
