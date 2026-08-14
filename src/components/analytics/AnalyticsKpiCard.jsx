import React from 'react';
import Card from '../common/Card';
import LucideIcon from '../common/LucideIcon';

export default function AnalyticsKpiCard({
  icon,
  iconColor,
  title,
  value,
  valueUnit,
  subtitle,
}) {
  return (
    <Card variant="kpi">
      <span className={`icon ${iconColor}`}>
        <LucideIcon name={icon} />
      </span>
      <p>{title}</p>
      <h2>
        {value}
        {valueUnit && <span>{valueUnit}</span>}
      </h2>
      <small>{subtitle}</small>
    </Card>
  );
}
