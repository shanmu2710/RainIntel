import React, { useState, useEffect, useMemo } from 'react';
import PageHeading from '../../components/common/PageHeading';
import Button from '../../components/common/Button';
import GisFilters from '../../components/gis/GisFilters';
import GisMap from '../../components/gis/GisMap';
import GisMapControls from '../../components/gis/GisMapControls';
import GisLegend from '../../components/gis/GisLegend';
import GisSiteCard from '../../components/gis/GisSiteCard';
import { api } from '../../services/api';

export default function GisIntelligence({ onNewAssessment, triggerToast }) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [districtFilter, setDistrictFilter] = useState('All');

  useEffect(() => {
    async function loadGisData() {
      try {
        const res = await api.assessments.list();
        
        const validAssessments = res.filter(a => 
          typeof a.latitude === 'number' && typeof a.longitude === 'number' &&
          !isNaN(a.latitude) && !isNaN(a.longitude) &&
          a.latitude >= -90 && a.latitude <= 90 &&
          a.longitude >= -180 && a.longitude <= 180
        );

        const mapped = validAssessments.map(a => {
          return {
            id: String(a.assessmentId),
            buildingName: a.buildingName,
            details: `Roof area ${a.roofAreaSqFt ? a.roofAreaSqFt.toLocaleString() : 0} sq ft · Potential ${a.harvestPotentialL ? Math.round(a.harvestPotentialL).toLocaleString() : 0} L`,
            statusRaw: a.status,
            districtName: a.districtName || 'Unknown',
            status: a.status === 'APPROVED' ? 'Completed' : a.status === 'SUBMITTED' ? 'In review' : 'Processing',
            latitude: a.latitude,
            longitude: a.longitude,
            roofAreaSqFt: a.roofAreaSqFt,
            harvestPotentialL: a.harvestPotentialL,
            rechargePotentialL: a.rechargePotentialL
          };
        });
        setLocations(mapped);
        if (mapped.length > 0) {
          setSelectedLocation(mapped[0]);
        }
      } catch (err) {
        if (triggerToast) triggerToast('Failed to load GIS assessments: ' + err.message, 'circle-alert');
      } finally {
        setLoading(false);
      }
    }
    loadGisData();
  }, [triggerToast]);

  const filteredLocations = useMemo(() => {
    return locations.filter(loc => {
      const matchSearch = loc.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) || loc.id.includes(searchQuery);
      const matchStatus = statusFilter === 'All' || loc.statusRaw === statusFilter || loc.status === statusFilter;
      const matchDistrict = districtFilter === 'All' || loc.districtName === districtFilter;
      return matchSearch && matchStatus && matchDistrict;
    });
  }, [locations, searchQuery, statusFilter, districtFilter]);

  // Synchronize selection cleanly after filtering
  useEffect(() => {
    if (filteredLocations.length > 0 && (!selectedLocation || !filteredLocations.find(l => l.id === selectedLocation.id))) {
      setSelectedLocation(filteredLocations[0]);
    } else if (filteredLocations.length === 0) {
      setSelectedLocation(null);
    }
  }, [filteredLocations, selectedLocation]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const handleLocationSelect = (loc) => setSelectedLocation(loc);

  const pageActions = (
    <>
      <Button variant="secondary" icon="layers" onClick={() => triggerToast && triggerToast('Layers currently disabled / unavailable')}>
        Layers
      </Button>
      <Button variant="primary" icon="plus" onClick={onNewAssessment}>
        New assessment
      </Button>
    </>
  );

  return (
    <>
      <PageHeading title="GIS intelligence" subtitle="Explore assessment coverage and water potential." actions={pageActions} />

      {/* Basic frontend filtering structure. Extend UI visually inside GisFilters component if dropdowns exist */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
         <input 
            placeholder="Search site or ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', minWidth: '240px' }}
         />
         <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter} style={{ padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px' }}>
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In review">In review</option>
         </select>
      </div>

      {loading ? (
        <div style={{ display: 'grid', placeItems: 'center', height: '550px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '13px' }}>
          <span>Loading GIS locations...</span>
        </div>
      ) : (
        <GisMap locations={filteredLocations} selectedLocation={selectedLocation} onLocationSelect={handleLocationSelect}>
          <GisMapControls
            onZoomIn={() => triggerToast && triggerToast('Zooming in GIS map...')}
            onZoomOut={() => triggerToast && triggerToast('Zooming out GIS map...')}
            onLocate={() => triggerToast && triggerToast('Locating your position...')}
            onCompass={() => triggerToast && triggerToast('Recalibrating compass...')}
          />
          <GisLegend />
          <GisSiteCard location={selectedLocation} />
        </GisMap>
      )}
    </>
  );
}
