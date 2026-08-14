import React, { useState, useEffect } from 'react';
import PageHeading from '../../components/common/PageHeading';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import SettingsProfile from '../../components/settings/SettingsProfile';
import SettingsNotifications from '../../components/settings/SettingsNotifications';
import SettingsPreferences from '../../components/settings/SettingsPreferences';
import SettingsSecurity from '../../components/settings/SettingsSecurity';

export default function Settings({ onSave, triggerToast }) {
  const [activeTab, setActiveTab] = useState('Profile');

  const loadPrivacy = () => {
    const saved = localStorage.getItem('rainintel.privacy');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { }
    }
    return {
      anonymousAnalytics: true,
      preciseLocation: true,
      aiTrainingFeedback: false
    };
  };
  const [privacy, setPrivacy] = useState(loadPrivacy());

  useEffect(() => {
    localStorage.setItem('rainintel.privacy', JSON.stringify(privacy));
  }, [privacy]);

  const togglePrivacy = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const loadProfile = () => {
    const saved = localStorage.getItem('pref_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        /* Ignore parse error */
      }
    }
    
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const name = user?.fullName || user?.username || 'Guest';
    const email = user?.email || '';

    return {
      name: name,
      employeeId: 'JSM-VJA-2047',
      email: email,
      phone: '+91 98765 43210',
      department: 'Jal Shakti Mission',
      district: 'Vijayawada'
    };
  };

  const [profile, setProfile] = useState(loadProfile());

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const validateProfile = () => {
    if (!profile.name || profile.name.trim() === '') {
      return 'Full name cannot be blank.';
    }
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      return 'Please enter a valid email address.';
    }
    return null;
  };

  const handleSaveClicked = () => {
    // We only process 'save' for the Profile tab since Preferences/Notifications are auto-saved
    if (activeTab === 'Profile') {
      const error = validateProfile();
      if (error) {
        if (triggerToast) triggerToast(error, 'circle-alert');
        return;
      }
      localStorage.setItem('pref_profile', JSON.stringify(profile));
      if (triggerToast) triggerToast('Profile changes saved on this device.');
      if (onSave) onSave();
    } else {
      if (triggerToast) triggerToast('Settings saved on this device.');
      if (onSave) onSave();
    }
  };

  const handleUpdatePassword = () => {
    if (triggerToast) triggerToast('Password update is currently unsupported by the backend API.', 'circle-alert');
  };

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'Profile':
        return <SettingsProfile profile={profile} onChange={handleProfileChange} />;
      case 'Notifications':
        return <SettingsNotifications />;
      case 'Preferences':
        return <SettingsPreferences />;
      case 'Security':
        return <SettingsSecurity onUpdatePassword={handleUpdatePassword} />;
      case 'Privacy':
        return (
          <>
            <Card className="setting-group">
              <h3>Data & privacy</h3>
              <p>Control how RainIntel uses assessment and device information.</p>
              <div className="toggle-row">
                <div>
                  <b>Anonymous product analytics</b>
                  <small>Help improve RainIntel using non-identifiable usage data.</small>
                </div>
                <span className="switch" style={{ cursor: 'pointer', background: privacy.anonymousAnalytics ? '#0f766e' : '#e2e8f0' }} onClick={() => togglePrivacy('anonymousAnalytics')}>
                  <i style={{ marginLeft: privacy.anonymousAnalytics ? 'auto' : '0', transition: 'margin 0.2s ease' }}></i>
                </span>
              </div>
              <div className="toggle-row">
                <div>
                  <b>Precise location data</b>
                  <small>Allow GPS metadata in assessment records.</small>
                </div>
                <span className="switch" style={{ cursor: 'pointer', background: privacy.preciseLocation ? '#0f766e' : '#e2e8f0' }} onClick={() => togglePrivacy('preciseLocation')}>
                  <i style={{ marginLeft: privacy.preciseLocation ? 'auto' : '0', transition: 'margin 0.2s ease' }}></i>
                </span>
              </div>
              <div className="toggle-row">
                <div>
                  <b>AI training feedback</b>
                  <small>Allow approved corrections to improve recommendation quality.</small>
                </div>
                <span className="switch" style={{ cursor: 'pointer', background: privacy.aiTrainingFeedback ? '#0f766e' : '#e2e8f0' }} onClick={() => togglePrivacy('aiTrainingFeedback')}>
                  <i style={{ marginLeft: privacy.aiTrainingFeedback ? 'auto' : '0', transition: 'margin 0.2s ease' }}></i>
                </span>
              </div>
            </Card>

            <Card className="setting-group">
              <h3 style={{ color: '#dc2626' }}>Danger zone</h3>
              <p>Actions here affect your local workspace preferences only.</p>
              <Button
                variant="secondary"
                icon="trash-2"
                style={{ color: '#dc2626', borderColor: '#fecaca' }}
                onClick={() => {
                  localStorage.clear(); 
                  if (triggerToast) triggerToast('Local cache cleared successfully.');
                  // Soft reload page state via reload
                  setTimeout(() => window.location.reload(), 1000);
                }}
              >
                Clear local cache
              </Button>
            </Card>
          </>
        );
      default:
        return null;
    }
  };

  const tabs = ['Profile', 'Notifications', 'Preferences', 'Security', 'Privacy'];

  return (
    <>
      <PageHeading
        title="Settings"
        subtitle="Manage your profile, preferences, and workspace security."
        actions={
          <Button variant="primary" icon="save" onClick={handleSaveClicked}>
            Save changes
          </Button>
        }
      />

      <div className="settings-layout">
        <aside className="card settings-menu">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={tab === activeTab ? 'selected' : ''}
              type="button"
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </aside>

        <div>{renderActivePanel()}</div>
      </div>
    </>
  );
}
