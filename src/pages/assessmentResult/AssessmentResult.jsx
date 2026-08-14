import React from 'react';
import PageHeading from '../../components/common/PageHeading';
import Button from '../../components/common/Button';
import AssessmentMetrics from '../../components/assessmentResult/AssessmentMetrics';
import RecommendationCard from '../../components/assessmentResult/RecommendationCard';
import WaterScoreCard from '../../components/assessmentResult/WaterScoreCard';

export default function AssessmentResult({ assessment, onReport, onDesign }) {
  const code = assessment ? `RIN-2026-${String(assessment.assessmentId).padStart(4, '0')}` : 'RIN-2026-0483';
  const name = assessment ? assessment.buildingName : 'Municipal Community Hall';

  const metrics = assessment ? [
    { label: 'Annual rainfall', value: `${Math.round(assessment.annualRainfallMm).toLocaleString()} mm` },
    { label: 'Harvest potential', value: `${Math.round(assessment.harvestPotentialL).toLocaleString()} L` },
    { label: 'Recharge potential', value: `${Math.round(assessment.rechargePotentialL).toLocaleString()} L` },
    { label: 'Storage capacity', value: `${Math.round(assessment.recommendedStorageL).toLocaleString()} L` },
    { label: 'Estimated cost', value: `₹ ${(Math.round(assessment.recommendedStorageL * 12.0) / 100000.0).toFixed(2)} L` },
    { label: 'Payback period', value: '3.8 years' },
  ] : null;

  const recs = assessment ? [
    { label: 'System', value: assessment.systemType },
    { label: 'Storage tank', value: `${Math.round(assessment.storageCapacityL).toLocaleString()} L HDPE tank` },
    { label: 'Recharge pit', value: assessment.rechargeType },
    { label: 'Filter', value: assessment.filterType },
    { label: 'Maintenance', value: 'Biannual cleaning' },
    { label: 'Environmental impact', value: `${Math.round(assessment.rechargePotentialL).toLocaleString()} L recharge / year` },
  ] : null;

  const confidence = assessment ? `${Math.round(assessment.confidenceScore)}%` : '96%';

  return (
    <>
      <PageHeading
        title="Assessment completed"
        subtitle={`${code} — ${name}`}
        actions={
          <>
            <Button variant="secondary" icon="file-text" onClick={onReport}>
              Report preview
            </Button>
            <Button variant="primary" icon="box" onClick={onDesign}>
              View 3D design
            </Button>
          </>
        }
      />

      <AssessmentMetrics metrics={metrics} />

      <div className="content-grid">
        <RecommendationCard recommendations={recs} confidence={confidence} />
        <WaterScoreCard />
      </div>
    </>
  );
}
