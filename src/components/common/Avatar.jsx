import React from 'react';

export default function Avatar({
  initials,
  className = '',
  as = 'span',
  onClick,
  ...props
}) {
  const Component = onClick ? 'button' : as;
  const avatarClass = `avatar ${className}`.trim();

  return (
    <Component
      className={avatarClass}
      onClick={onClick}
      {...(onClick && { type: 'button' })}
      {...props}
    >
      {initials}
    </Component>
  );
}
