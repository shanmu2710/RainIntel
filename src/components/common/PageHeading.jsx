import React from 'react';

export default function PageHeading({
  title,
  subtitle,
  actions,
  className = '',
  ...props
}) {
  return (
    <div className={`page-heading ${className}`.trim()} {...props}>
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="toolbar">{actions}</div>}
    </div>
  );
}
