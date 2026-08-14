import React from 'react';

export default function AIProcessingSteps({ steps }) {
  const defaultSteps = [
    { name: '1. Assessment submitted', isComplete: true, isPending: false },
    { name: '2. GIS/location data evaluated', isComplete: true, isPending: false },
    { name: '3. Rainfall data evaluated', isComplete: true, isPending: false },
    { name: '4. Harvest potential calculated', isComplete: true, isPending: false },
    { name: '5. Recharge potential calculated', isComplete: true, isPending: false },
    { name: '6. Storage requirement calculated', isComplete: true, isPending: false },
    { name: '7. RWH recommendation generated', isComplete: true, isPending: false },
    { name: '8. Assessment results ready', isComplete: true, isPending: false },
  ];

  const list = steps || defaultSteps;

  return (
    <ul className="timeline">
      {list.map((step, i) => (
        <li key={i} className={step.isPending ? 'pending' : ''}>
          {step.name}
          {step.isComplete && ' — Complete'}
        </li>
      ))}
    </ul>
  );
}
