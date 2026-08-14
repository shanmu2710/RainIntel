import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { api } from '../../services/api';

export default function SettingsProfile({ profile, onUploadClick, onRemoveClick, onChange }) {
  const [districts, setDistricts] = useState([]);
  
  useEffect(() => {
    async function loadDistricts() {
      try {
        const dStr = await api.districts.getAll();
        setDistricts(dStr || []);
      } catch (err) {
        console.error('Failed to load districts from API', err);
      }
    }
    loadDistricts();
  }, []);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const initName = user?.fullName || user?.username || 'Guest';
  const initEmail = user?.email || '';

  const defaultProfile = {
    name: initName,
    employeeId: 'JSM-VJA-2047',
    email: initEmail,
    phone: '+91 98765 43210',
    department: 'Jal Shakti Mission',
    districtSelect: 'Vijayawada',
  };

  const data = profile || defaultProfile;

  return (
    <>
      <Card className="setting-group">
        <h3>Personal profile</h3>
        <p>Manage your account details and profile information. <i>(Saved to account)</i></p>
        <div className="profile-edit">
          <Avatar initials={data.name ? data.name.substring(0, 2).toUpperCase() : 'AS'} />
          <Button variant="secondary" icon="upload-cloud" onClick={onUploadClick}>
            Upload new photo
          </Button>
          <Button
            variant="secondary"
            icon="trash-2"
            style={{ color: '#64748b', borderColor: 'transparent' }}
            onClick={onRemoveClick}
          >
            Remove
          </Button>
        </div>
        <div className="form-grid">
          <label>
            Full name
            <input
              value={data.name}
              onChange={(e) => onChange && onChange('name', e.target.value)}
            />
          </label>
          <label>
            Employee ID
            <input
              value={data.employeeId}
              onChange={(e) => onChange && onChange('employeeId', e.target.value)}
            />
          </label>
          <label>
            Email
            <input
              value={data.email}
              onChange={(e) => onChange && onChange('email', e.target.value)}
            />
          </label>
          <label>
            Phone
            <input
              value={data.phone}
              onChange={(e) => onChange && onChange('phone', e.target.value)}
            />
          </label>
        </div>
      </Card>

      <Card className="setting-group">
        <h3>Department information</h3>
        <p>Your assigned organisation and operational district.</p>
        <div className="form-grid">
          <label>
            Department
            <input
              value={data.department}
              onChange={(e) => onChange && onChange('department', e.target.value)}
            />
          </label>
          <label>
            District
            <select
              value={data.district || data.districtSelect}
              onChange={(e) => onChange && onChange('district', e.target.value)}
            >
              {districts.map(d => (
                <option key={d.districtId || d.id || d.name} value={d.name}>{d.name}</option>
              ))}
              {districts.length === 0 && <option value="Vijayawada">Vijayawada</option>}
            </select>
          </label>
        </div>
      </Card>
    </>
  );
}
