import React from 'react';
import * as Icons from 'lucide-react';

export default function LucideIcon({ name, size, className, ...props }) {
  if (!name) return null;

  // Map the kebab-case names to PascalCase names used by lucide-react
  const getPascalName = (str) => {
    // Specific manual mappings for edge cases
    if (str === 'rotate-3d') return 'Rotate3d';
    if (str === 'chart-no-axes-combined') return 'ChartNoAxesCombined';
    
    return str
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  };

  const pascalName = getPascalName(name);
  const IconComponent = Icons[pascalName] || Icons[name] || Icons.HelpCircle;

  return <IconComponent size={size} className={className} {...props} />;
}
