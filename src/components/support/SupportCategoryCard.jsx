import React from 'react';
import Card from '../common/Card';
import LucideIcon from '../common/LucideIcon';

export default function SupportCategoryCard({ icon, iconColor, title, desc, onClick }) {
  return (
    <Card className="support-tile" onClick={onClick}>
      <span className={`icon ${iconColor}`}>
        <LucideIcon name={icon} />
      </span>
      <h3>{title}</h3>
      <p>{desc}</p>
    </Card>
  );
}
