import React from 'react';
import DashboardLayout from './DashboardLayout';

export default function FieldEngineerLayout({ children }) {
  return (
    <div className="field-engineer-layout">
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </div>
  );
}
