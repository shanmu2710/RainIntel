import React from 'react';
import Card from '../common/Card';
import LucideIcon from '../common/LucideIcon';

export default function QuickActions({ onAction }) {
  const actions = [
    {
      title: 'New assessment',
      subtitle: 'Start a rooftop survey',
      icon: 'plus',
      colorClass: 'teal',
      actionKey: 'new-assessment',
    },
    {
      title: 'Open GIS map',
      subtitle: 'Explore assessments',
      icon: 'map',
      colorClass: 'blue',
      actionKey: 'open-map',
    },
    {
      title: 'Generate report',
      subtitle: 'Create government PDF',
      icon: 'file-down',
      colorClass: 'purple-bg',
      actionKey: 'generate-report',
    },
  ];

  return (
    <Card className="quick">
      <div className="card-title">
        <div>
          <h3>Quick actions</h3>
          <p>Get started quickly</p>
        </div>
      </div>
      {actions.map((act, index) => (
        <button
          key={index}
          className="quick-action"
          onClick={() => onAction && onAction(act.actionKey)}
        >
          <span className={`icon ${act.colorClass}`}>
            <LucideIcon name={act.icon} />
          </span>
          <div>
            <b>{act.title}</b>
            <small>{act.subtitle}</small>
          </div>
          <LucideIcon name="arrow-right" />
        </button>
      ))}
    </Card>
  );
}
