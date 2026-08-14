import React from 'react';

export default function PageContainer({ children, className = '', ...props }) {
  return (
    <section className={`page ${className}`.trim()} {...props}>
      {children}
    </section>
  );
}

