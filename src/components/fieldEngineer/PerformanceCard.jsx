import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import LucideIcon from '../common/LucideIcon';
import { api } from '../../services/api';

export function WaterHarvestChart() {
  return (
    <Card className="performance">
      <div className="card-title">
        <div>
          <h3>Water harvest potential</h3>
          <p>Monthly projected yield <span className="legend"><b></b>2026</span></p>
        </div>
      </div>
      <div style={{ display: 'grid', placeItems: 'center', height: '180px', color: '#64748b', textAlign: 'center', fontSize: '12px', background: '#f8fafc', borderRadius: '8px', marginTop: '16px', border: '1px solid #f1f5f9' }}>
        <div>
          <LucideIcon name="bar-chart-2" style={{ marginBottom: '8px', opacity: 0.5, width: '24px', height: '24px' }} />
          <p>No historical data available yet.<br/>Current totals are available in KPI cards.</p>
        </div>
      </div>
    </Card>
  );
}

export function DistrictPerformanceCard() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRankings() {
      try {
        const topRanked = await api.analytics.getDistrictRanking();
        setDistricts(Array.isArray(topRanked) ? topRanked : []);
      } catch (err) {
        setDistricts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRankings();
  }, []);

  const colorClasses = ['one', 'two', 'three', 'one', 'two'];

  return (
    <Card className="district">
      <div className="card-title">
        <div>
          <h3>District performance</h3>
          <p>Assessment completion ranking</p>
        </div>
      </div>
      
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>Loading rankings...</div>
      ) : districts.length === 0 ? (
        <div style={{ display: 'grid', placeItems: 'center', height: '180px', color: '#64748b', textAlign: 'center', fontSize: '12px', background: '#f8fafc', borderRadius: '8px', marginTop: '16px', border: '1px solid #f1f5f9' }}>
          <div>
            <LucideIcon name="map" style={{ marginBottom: '8px', opacity: 0.5, width: '24px', height: '24px' }} />
            <p>No district ranking data available.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="donut">
            <div>
              <b>{districts.reduce((sum, d) => sum + (d.assessmentsCount || 0), 0)}</b>
              <span>Total</span>
            </div>
          </div>
          <ul className="district-list">
            {districts.slice(0, 3).map((d, index) => (
              <li key={index}>
                <span>
                  <b className={`dot ${colorClasses[index % colorClasses.length]}`}></b>
                  {d.districtName || 'Unknown District'}
                </span>
                <strong>{d.assessmentsCount}</strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
