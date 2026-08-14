import React from 'react';
import Card from '../common/Card';
import LucideIcon from '../common/LucideIcon';

export default function KpiCard({
  icon,
  iconColor,
  trend,
  trendType = 'up', // 'up' or 'neutral'
  title,
  value,
  valueUnit,
  subtitle,
  sparkText,
  sparkColorClass,
  showProgressBar = false,
  progressWidth = '94.6%',
}) {
  return (
    <Card variant="kpi">
      <div className="kpi-head">
        <span className={`icon ${iconColor}`}>
          <LucideIcon name={icon} />
        </span>
        <span className={`trend ${trendType}`}>
          {trendType === 'up' && <LucideIcon name="arrow-up-right" />}
          {trend}
        </span>
      </div>
      <p>{title}</p>
      <h2>
        {value}
        {valueUnit && <span>{valueUnit}</span>}
      </h2>
      <small>{subtitle}</small>
      {sparkText && (
        <div className={`spark ${sparkColorClass}`}>
          {sparkText}
        </div>
      )}
      {showProgressBar && (
        <div className="progress">
          <i style={{ width: progressWidth }}></i>
        </div>
      )}
    </Card>
  );
}
