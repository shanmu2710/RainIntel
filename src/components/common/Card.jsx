import React from 'react';

export default function Card({
  children,
  className = '',
  variant = 'card', // 'card', 'kpi', 'form-card', 'table-card'
  ...props
}) {
  const getCardClass = () => {
    if (variant === 'table-card') return 'card table-card';
    return variant; // 'card', 'kpi', 'form-card'
  };

  const cardClass = `${getCardClass()} ${className}`.trim();

  return (
    <article className={cardClass} {...props}>
      {children}
    </article>
  );
}
