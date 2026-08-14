import React, { useState, useEffect } from 'react';
import PageHeading from '../../components/common/PageHeading';
import Button from '../../components/common/Button';
import ReportFilters from '../../components/reports/ReportFilters';
import ReportTable from '../../components/reports/ReportTable';
import { api } from '../../services/api';

export default function Reports({ onExport, onReportSelect }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const res = await api.assessments.list();
        const mapped = res.map((a) => {
          const reportId = `RIN-2026-${String(a.assessmentId).padStart(4, '0')}`;
          return {
            id: reportId,
            building: a.buildingName,
            engineer: 'Jal Shakti Engineer',
            date: new Date(a.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
            status: a.status === 'APPROVED' ? 'Completed' : a.status === 'SUBMITTED' ? 'In review' : 'Processing',
            potential: `${Math.round(a.harvestPotentialL || 0).toLocaleString()} L`,
            raw: a
          };
        });
        setReports(mapped);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleExportClick = () => {
    if (onExport) onExport();
  };

  return (
    <>
      <PageHeading
        title="Assessment reports"
        subtitle="Government-ready assessment reports and design recommendations."
        actions={
          <Button variant="secondary" icon="download" onClick={handleExportClick}>
            Export register
          </Button>
        }
      />

      <ReportFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        districtFilter="All districts"
        statusFilter="All status"
      />

      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', height: '200px', fontSize: '13px', color: '#64748b' }}>
          Loading reports...
        </div>
      ) : (
        <ReportTable
          reports={reports}
          onReportSelect={(rep) => {
            if (onReportSelect) {
              const a = rep.raw;
              onReportSelect({
                id: rep.id,
                building: rep.building,
                engineer: rep.engineer,
                district: a.districtName ? `${a.districtName} District` : 'District Unknown',
                potential: `${Math.round(a.harvestPotentialL || 0).toLocaleString()} litres`,
                recommendation: a.recommendationReason || (a.systemType ? `Install a ${a.systemType} system. Recommended storage is ${Math.round(a.storageCapacityL || 0).toLocaleString()} L with a ${a.filterType || 'filter'} and ${a.rechargeType || 'recharge type'}.` : 'No recommendation data generated on backend.'),
                raw: a
              });
            }
          }}
        />
      )}
    </>
  );
}
