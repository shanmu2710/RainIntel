import React, { useState, useEffect } from 'react';
import PageHeading from '../../components/common/PageHeading';
import Button from '../../components/common/Button';
import AnalyticsFilters from '../../components/analytics/AnalyticsFilters';
import AnalyticsKpiCard from '../../components/analytics/AnalyticsKpiCard';
import AssessmentTrendChart from '../../components/analytics/AssessmentTrendChart';
import WaterPotentialChart from '../../components/analytics/WaterPotentialChart';
import EngineerRanking from '../../components/analytics/EngineerRanking';
import AnalyticsSummary from '../../components/analytics/AnalyticsSummary';
import { api } from '../../services/api';

export default function Analytics({ onExport }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchSummary() {
      try {
        const data = await api.analytics.getSummary();
        setSummary(data);
      } catch (err) {
        console.error('Failed to load analytics summary', err);
        setErrorMsg('Unable to retrieve analytics summary.');
      } finally {
        setLoading(false);
      }
    }
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <>
        <PageHeading
          title="Analytics"
          subtitle="Executive intelligence for your district."
        />
        <div style={{ display: 'grid', placeItems: 'center', height: '400px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <span>Loading analytics data...</span>
        </div>
      </>
    );
  }

  if (errorMsg) {
    return (
      <>
        <PageHeading
          title="Analytics"
          subtitle="Executive intelligence for your district."
        />
        <div style={{ display: 'grid', placeItems: 'center', height: '400px', background: '#fee2e2', borderRadius: '12px', border: '1px solid #fca5a5', color: '#991b1b' }}>
          <span>{errorMsg}</span>
        </div>
      </>
    );
  }

  if (!summary || summary.totalAssessments === 0) {
    return (
      <>
        <PageHeading
          title="Analytics"
          subtitle="Executive intelligence for your district."
        />
        <div style={{ display: 'grid', placeItems: 'center', height: '400px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <span>No analytics data available for the current period.</span>
        </div>
      </>
    );
  }

  const totalHarvest = (summary.totalHarvestedLiters / 1000000.0).toFixed(2);
  const totalAssessments = summary.totalAssessments;
  const avgConf = summary.averageConfidence;
  const rechargePotential = (summary.totalHarvestedLiters * 0.4 / 1000000.0).toFixed(2);

  const kpis = [
    {
      title: 'Water saved',
      value: String(totalHarvest),
      valueUnit: ' M L',
      icon: 'droplets',
      iconColor: 'teal',
      subtitle: 'Projected annually',
    },
    {
      title: 'Avg. assessment time',
      value: 'N/A', // Not supported by current API
      valueUnit: '',
      icon: 'timer',
      iconColor: 'blue',
      subtitle: 'Depends on field agent activity',
    },
    {
      title: 'Analysis confidence',
      value: String(avgConf),
      valueUnit: '%',
      icon: 'circle-check',
      iconColor: 'green',
      subtitle: `Across ${totalAssessments} assessments`,
    },
    {
      title: 'Recharge contribution',
      value: String(rechargePotential),
      valueUnit: ' M L',
      icon: 'trees',
      iconColor: 'amber',
      subtitle: 'Annual groundwater potential',
    },
  ];

  return (
    <>
      <PageHeading
        title="Analytics"
        subtitle="Executive intelligence for your district."
        actions={
          <Button variant="secondary" icon="download" onClick={onExport}>
            Export
          </Button>
        }
      />

      <AnalyticsFilters
        districtFilter="All Districts"
        periodFilter="This year"
      />

      <div className="kpis">
        {kpis.map((kpi, index) => (
          <AnalyticsKpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="analytics-grid" style={{ marginTop: '17px' }}>
        <AssessmentTrendChart />
        <EngineerRanking />
        <WaterPotentialChart />
      </div>

      <AnalyticsSummary />
    </>
  );
}
