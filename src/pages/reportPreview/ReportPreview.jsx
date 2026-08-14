import React from 'react';
import LucideIcon from '../../components/common/LucideIcon';
import PageHeading from '../../components/common/PageHeading';
import Button from '../../components/common/Button';
import ReportSummary from '../../components/reportPreview/ReportSummary';
import ReportDetails from '../../components/reportPreview/ReportDetails';
import ReportMetrics from '../../components/reportPreview/ReportMetrics';

export default function ReportPreview({ report, onPrint, onDownload, onBack }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const name = user?.fullName || user?.username || 'Guest';

  const defaultReport = {
    id: 'RIN-2026-0483',
    building: 'Municipal Community Hall',
    engineer: name,
    district: 'Vijayawada District',
    potential: '118,400 litres',
    recommendation: 'Install a hybrid 15,000 L storage system with a dual-media filter and recharge pit. This design provides strong reliability during monsoon peaks and contributes 47,360 L annually to groundwater recharge.',
  };

  const data = report || defaultReport;

  return (
    <>
      <div style={{ paddingBottom: '16px' }}>
        <button className="back" onClick={onBack}>
          <LucideIcon name="arrow-left" />
          Back to Reports
        </button>
      </div>
      <PageHeading
        title="Report preview"
        subtitle={`Government assessment report — ${data.id}`}
        actions={
          <>
            <Button variant="secondary" icon="printer" onClick={onPrint}>
              Print
            </Button>
            <Button variant="primary" icon="download" onClick={onDownload}>
              Download PDF
            </Button>
          </>
        }
      />

      <article className="report-preview">
        <ReportSummary district={data.district} />

        <ReportDetails
          building={data.building}
          id={data.id}
          engineer={data.engineer}
        />

        <ReportMetrics potential={data.potential} />

        <div className="report-section">
          <h4>RECOMMENDATION</h4>
          <p style={{ fontSize: '12px', lineHeight: 1.7, color: '#475569' }}>
            {data.recommendation}
          </p>
        </div>
      </article>
    </>
  );
}
