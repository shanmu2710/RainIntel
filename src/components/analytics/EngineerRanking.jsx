import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import LucideIcon from '../common/LucideIcon';
import { api } from '../../services/api';

export default function EngineerRanking() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const topRanked = await api.analytics.getDistrictRanking();
        setDistricts(Array.isArray(topRanked) ? topRanked : []);
      } catch (err) {
        setDistricts([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <Card>
      <div className="card-title">
        <div>
          <h3>Leading Districts</h3>
          <p>By completed assessments</p>
        </div>
      </div>
      
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>Loading...</div>
      ) : districts.length === 0 ? (
        <div style={{ display: 'grid', placeItems: 'center', height: '140px', color: '#64748b', textAlign: 'center', fontSize: '12px', background: '#f8fafc', borderRadius: '8px', marginTop: '12px', border: '1px solid #f1f5f9' }}>
          <div>
            <LucideIcon name="bar-chart" style={{ marginBottom: '8px', opacity: 0.5, width: '20px', height: '20px' }} />
            <p>No district statistics available.</p>
          </div>
        </div>
      ) : (
        <ul className="rank">
          {districts.slice(0, 4).map((d, i) => (
            <li key={i}>
              <span>0{i + 1}</span>
              <Avatar initials={(d.districtName || 'UNK').substring(0,2).toUpperCase()} />
              <div>
                <b>{d.districtName}</b>
                <small>District Record</small>
              </div>
              <strong>{d.assessmentsCount}</strong>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
