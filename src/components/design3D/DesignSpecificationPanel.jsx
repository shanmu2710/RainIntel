import React from 'react';

function SectionTitle({ children }) {
  return <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#64748b', letterSpacing: '0.05em', marginBottom: '12px', marginTop: '24px' }}>{children}</h4>;
}

function SpecRow({ label, value, note }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
      <span style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>{label}</span>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#0f172a' }}>{value}</span>
        {note && <span style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic', maxWidth: '50%', textAlign: 'right' }}>{note}</span>}
      </div>
    </div>
  );
}

export default function DesignSpecificationPanel({ assessment }) {
  const code = assessment ? `RIN-2026-${String(assessment.assessmentId).padStart(4, '0')}` : 'Unknown';

  return (
    <div className="card" style={{ padding: '20px', overflowY: 'auto', maxHeight: '550px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>Engineering Specification</h3>
      <p style={{ fontSize: '13px', color: '#64748b', paddingBottom: '16px', borderBottom: '1px solid #cbd5e1' }}>
        Ref: {code} | Data-driven estimation
      </p>

      <SectionTitle>Site Data</SectionTitle>
      <SpecRow label="Building" value={assessment.buildingName || 'Not available'} />
      <SpecRow label="District" value={assessment.districtName || 'Not available'} />
      <SpecRow label="Roof Area" value={assessment.roofAreaSqFt ? `${assessment.roofAreaSqFt} sq ft` : 'Not available'} note="Calculated from assessment" />
      <SpecRow label="Roof Material" value={assessment.roofMaterial || 'Not available'} />
      <SpecRow label="Roof Slope" value={assessment.roofSlope ? `${assessment.roofSlope}°` : 'Visualized slope — site slope not provided'} note="Visual representation" />
      <SpecRow label="Annual Rainfall" value={assessment.annualRainfallMm ? `${assessment.annualRainfallMm} mm` : 'Not available'} />
      <SpecRow label="Runoff Coefficient" value={assessment.runoffCoefficient || 'Not available'} />

      <SectionTitle>RWH Results</SectionTitle>
      <SpecRow label="Harvest Potential" value={assessment.harvestPotentialL ? `${Math.round(assessment.harvestPotentialL).toLocaleString()} L` : 'Not available'} note="Calculated from assessment" />
      <SpecRow label="Recharge Potential" value={assessment.rechargePotentialL ? `${Math.round(assessment.rechargePotentialL).toLocaleString()} L` : 'Not available'} note="Calculated from assessment" />
      <SpecRow label="Recommended Storage" value={assessment.recommendedStorageL ? `${Math.round(assessment.recommendedStorageL).toLocaleString()} L` : 'Not available'} />
      <SpecRow label="Confidence Score" value={assessment.confidenceScore ? `${Math.round(assessment.confidenceScore)}%` : 'Not available'} />

      <SectionTitle>System Design</SectionTitle>
      <SpecRow label="Filter Type" value={assessment.filterType || 'Default Filter'} note="Calculated from assessment" />
      <SpecRow label="Recharge Type" value={assessment.rechargeType || 'Default Pit'} note="Calculated from assessment" />
      <SpecRow label="System Type" value={assessment.systemType || 'Not available'} />

      <SectionTitle>Preliminary Component Spec</SectionTitle>
      <SpecRow label="Gutter Dimensions" value="Preliminary / estimated" note="Estimated / visual representation" />
      <SpecRow label="Downpipe Diameter" value="Preliminary" note="Visualized pipe path" />
      <SpecRow label="Filter Chamber" value="Preliminary" note="Estimated / visual representation" />
      <SpecRow label="Storage Tank" value={assessment.storageCapacityL ? `${Math.round(assessment.storageCapacityL).toLocaleString()} L Capacity` : 'Not available'} note="Calculated from assessment" />
      <SpecRow label="Recharge Structure" value="Preliminary dimensions" note="Site verification required" />

    </div>
  );
}
