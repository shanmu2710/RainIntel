import React, { useState, useEffect } from 'react';
import PageHeading from '../../components/common/PageHeading';
import Button from '../../components/common/Button';
import AssessmentFilters from '../../components/assessments/AssessmentFilters';
import AssessmentTable from '../../components/assessments/AssessmentTable';
import { api } from '../../services/api';

export default function Assessments({ onNewAssessment, onRowClick }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        setLoading(true);
        const data = await api.assessments.list();
        const mappedData = data.map((item) => ({
          id: `RIN-${item.assessmentId}`,
          building: item.buildingName,
          engineer: 'Assigned Engineer',
          status: item.status || 'Processing',
          roofArea: item.roofAreaSqFt ? `${item.roofAreaSqFt} sq ft` : '-',
          potential: item.harvestPotentialL ? `${item.harvestPotentialL.toLocaleString()} L` : '-',
          updated: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Now',
          raw: item,
        }));
        setAssessments(mappedData);
        setError(null);
      } catch (err) {
        console.error('Failed to load assessments:', err);
        setError('Failed to load assessments. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAssessments();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredAssessments = assessments.filter(a => 
    a.building.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <PageHeading
        title="Assessments"
        subtitle="Manage field surveys and monitor AI processing progress."
        actions={
          <Button variant="primary" icon="plus" onClick={onNewAssessment}>
            New assessment
          </Button>
        }
      />

      <AssessmentFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        statusFilter="All statuses"
        timeFilter="This month"
      />

      {error ? (
        <div style={{ padding: '20px', color: 'red', background: '#fee2e2', borderRadius: '8px' }}>
          {error}
        </div>
      ) : loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          Loading assessments...
        </div>
      ) : assessments.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
          No assessments found. Create one to get started.
        </div>
      ) : (
        <AssessmentTable
          assessments={filteredAssessments}
          onRowClick={(a) => {
            if (onRowClick) onRowClick(a);
          }}
        />
      )}
    </>
  );
}
