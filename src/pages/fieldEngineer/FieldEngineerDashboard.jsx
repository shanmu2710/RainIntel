import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import KpiCard from '../../components/fieldEngineer/KpiCard';
import { WaterHarvestChart, DistrictPerformanceCard } from '../../components/fieldEngineer/PerformanceCard';
import RecentAssessmentsTable from '../../components/fieldEngineer/RecentAssessmentsTable';
import QuickActions from '../../components/fieldEngineer/QuickActions';
import { api } from '../../services/api';

export default function FieldEngineerDashboard({ onNewAssessment, onQuickAction }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isFieldEngineer = user?.role === 'FIELD_ENGINEER';

  const [summary, setSummary] = useState(null);
  const [recentAssessments, setRecentAssessments] = useState([]);
  const [totalRecharge, setTotalRecharge] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [summaryData, listData] = await Promise.all([
          isFieldEngineer ? Promise.resolve(null) : api.analytics.getSummary().catch(() => null),
          api.assessments.list().catch(() => [])
        ]);
        
        if (summaryData) setSummary(summaryData);
        
        if (listData && Array.isArray(listData)) {
          if (isFieldEngineer) {
            const harvestSum = listData.reduce((acc, curr) => acc + (typeof curr.harvestPotentialL === 'number' ? curr.harvestPotentialL : 0), 0);
            const confList = listData.filter(i => typeof i.confidenceScore === 'number');
            const confAvg = confList.length > 0 ? Math.round(confList.reduce((acc, curr) => acc + curr.confidenceScore, 0) / confList.length) : null;
            
            setSummary({
              totalAssessments: listData.length,
              totalHarvestedLiters: harvestSum,
              averageConfidence: confAvg
            });
          }

          const sumRecharge = listData.reduce((acc, curr) => acc + (typeof curr.rechargePotentialL === 'number' ? curr.rechargePotentialL : 0), 0);
          setTotalRecharge(sumRecharge);

          const recent = listData.slice(0, 5).map(item => ({
            id: `RIN-${item.assessmentId}`,
            buildingName: item.buildingName,
            status: item.status || 'Draft',
            potential: item.harvestPotentialL ? `${item.harvestPotentialL.toLocaleString(undefined, {maximumFractionDigits: 2})} L` : '—',
            date: item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Now',
            icon: item.buildingType === 'Government' ? 'landmark' : 'warehouse',
            iconColorClass: item.buildingType === 'Government' ? 'blue-bg' : '',
          }));
          setRecentAssessments(recent);
        }
      } catch (err) {
        console.error("Dashboard fetch error", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalAssessments = summary?.totalAssessments || 0;
  
  let harvestVolRender = '-';
  let harvestUnitRender = ' L';
  if (!loading) {
    if (isFieldEngineer && totalAssessments === 0) {
      harvestVolRender = 'No water potential data available';
      harvestUnitRender = '';
    } else {
      const vol = summary?.totalHarvestedLiters || 0;
      harvestVolRender = vol.toLocaleString(undefined, {maximumFractionDigits: 2});
    }
  }

  let rechargeVolRender = '-';
  let rechargeUnitRender = ' L';
  if (!loading) {
    if (isFieldEngineer && totalAssessments === 0) {
      rechargeVolRender = 'No water potential data available';
      rechargeUnitRender = '';
    } else {
      rechargeVolRender = totalRecharge.toLocaleString(undefined, {maximumFractionDigits: 2});
    }
  }

  let confRender = '-';
  let confUnitRender = '%';
  let showConfProgress = false;
  let confProgressWidth = '0%';
  if (!loading) {
    if (isFieldEngineer && (summary?.averageConfidence === null || summary?.averageConfidence === undefined)) {
      confRender = 'No confidence data available';
      confUnitRender = '';
    } else {
      confRender = summary?.averageConfidence || 0;
      showConfProgress = true;
      confProgressWidth = `${confRender}%`;
    }
  }

  const kpis = [
    {
      title: 'Total assessments',
      value: loading ? '-' : totalAssessments,
      trend: 'Real-time',
      trendType: 'neutral',
      icon: 'clipboard-list',
      iconColor: 'teal',
      subtitle: 'Total completed surveys',
    },
    {
      title: 'Harvest potential',
      value: harvestVolRender,
      valueUnit: harvestUnitRender,
      trend: 'Real-time',
      trendType: 'neutral',
      icon: 'cloud-rain-wind',
      iconColor: 'blue',
      subtitle: 'Annual water potential',
    },
    {
      title: 'Recharge potential',
      value: rechargeVolRender,
      valueUnit: rechargeUnitRender,
      trend: 'Real-time',
      trendType: 'neutral',
      icon: 'waves',
      iconColor: 'green',
      subtitle: 'Groundwater contribution',
    },
    {
      title: 'Confidence avg',
      value: confRender,
      valueUnit: confUnitRender,
      trend: 'Analytics',
      trendType: 'neutral',
      icon: 'circle-check-big',
      iconColor: 'amber',
      subtitle: 'Calculation Confidence score',
      showProgressBar: showConfProgress,
      progressWidth: confProgressWidth,
    },
  ];

  const handleQuickAction = (actionKey) => {
    if (actionKey === 'new-assessment') {
      if (onNewAssessment) onNewAssessment();
    } else {
      if (onQuickAction) onQuickAction(actionKey);
    }
  };

  return (
    <>
      <div className="hero-row">
        <div>
          <p className="lead">Here’s how your water intelligence network is performing today.</p>
        </div>
        <Button
          variant="primary"
          icon="plus"
          onClick={onNewAssessment}
        >
          New assessment
        </Button>
      </div>

      <div className="kpis">
        {kpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      {!isFieldEngineer && (
        <div className="content-grid">
          <WaterHarvestChart />
          <DistrictPerformanceCard />
        </div>
      )}

      <div className="lower-grid">
        {loading ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            Loading recent assessments...
          </div>
        ) : recentAssessments.length === 0 ? (
          <div className="card" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No assessments found. Create one to get started.
          </div>
        ) : (
          <RecentAssessmentsTable assessments={recentAssessments} />
        )}
        <QuickActions onAction={handleQuickAction} />
      </div>
    </>
  );
}
