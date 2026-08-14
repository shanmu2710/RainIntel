import React from 'react';

export default function AIProcessingProgress() {
  return (
    <div style={{ textAlign: 'center', padding: '30px', margin: '20px 0', border: '1px solid #e2e8f0', borderRadius: '12px', background: '#fff' }}>
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <b style={{ fontSize: '42px', color: '#10b981', lineHeight: '1', marginBottom: '8px' }}>✓</b>
        <h2 style={{ margin: '0', fontSize: '20px', color: '#0f172a', fontWeight: '600' }}>CALCULATION COMPLETE</h2>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '6px', marginBottom: '0' }}>
          Result payload synchronized successfully.
        </p>
      </div>
    </div>
  );
}
