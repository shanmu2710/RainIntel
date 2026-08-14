import React from 'react';
import LucideIcon from './LucideIcon';

export default function Button({
  children,
  variant = 'primary', // 'primary', 'secondary', 'table-btn', 'dots'
  icon,
  iconPosition = 'left', // 'left' or 'right'
  className = '',
  onClick,
  type = 'button',
  style,
  ...props
}) {
  const btnClass = variant ? `${variant} ${className}`.trim() : className;

  return (
    <button
      type={type}
      className={btnClass}
      onClick={onClick}
      style={style}
      {...props}
    >
      {icon && iconPosition === 'left' && <LucideIcon name={icon} />}
      {children}
      {icon && iconPosition === 'right' && <LucideIcon name={icon} />}
    </button>
  );
}
