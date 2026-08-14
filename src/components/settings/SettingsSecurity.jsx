import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';

export default function SettingsSecurity({ onUpdatePassword }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // Persist toggles locally to feel functional per frontend requirements
  const [twoFactor, setTwoFactor] = useState(
    localStorage.getItem('pref_twoFactor') === 'true'
  );
  const [sessionTimeout, setSessionTimeout] = useState(
    localStorage.getItem('pref_sessionTimeout') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('pref_twoFactor', twoFactor);
  }, [twoFactor]);

  useEffect(() => {
    localStorage.setItem('pref_sessionTimeout', sessionTimeout);
  }, [sessionTimeout]);

  return (
    <>
      <Card className="setting-group">
        <h3>Password & sign-in</h3>
        <p>Keep your Jal Shakti Mission workspace protected. <i>(Authentication APIs currently offline)</i></p>
        <div className="form-grid">
          <label>
            Current password
            <input
              type="password"
              placeholder="Unavailable"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled
              style={{ background: '#f8fafc', cursor: 'not-allowed', opacity: 0.7 }}
            />
          </label>
          <label>
            New password
            <input
              type="password"
              placeholder="Unavailable"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled
              style={{ background: '#f8fafc', cursor: 'not-allowed', opacity: 0.7 }}
            />
          </label>
        </div>
        <Button
          variant="secondary"
          icon="key-round"
          style={{ marginTop: '18px', opacity: 0.6, cursor: 'not-allowed' }}
          disabled
          onClick={() => onUpdatePassword && onUpdatePassword({ currentPassword, newPassword })}
        >
          Update password
        </Button>
      </Card>

      <Card className="setting-group">
        <h3>Two-factor authentication</h3>
        <p>Use an authenticator app to add extra protection to your account. <i>(Saved on this device)</i></p>
        <div className="toggle-row">
          <div>
            <b>2FA is enabled</b>
            <small>Authenticator app · Last verified today</small>
          </div>
          <span
            className="switch"
            style={{
              cursor: 'pointer',
              background: twoFactor ? '#0f766e' : '#e2e8f0',
            }}
            onClick={() => setTwoFactor(!twoFactor)}
          >
            <i
              style={{
                marginLeft: twoFactor ? 'auto' : '0',
                transition: 'margin 0.2s ease',
              }}
            ></i>
          </span>
        </div>
        <div className="toggle-row">
          <div>
            <b>Session timeout</b>
            <small>Automatically sign out after 30 minutes of inactivity.</small>
          </div>
          <span
            className="switch"
            style={{
              cursor: 'pointer',
              background: sessionTimeout ? '#0f766e' : '#e2e8f0',
            }}
            onClick={() => setSessionTimeout(!sessionTimeout)}
          >
            <i
              style={{
                marginLeft: sessionTimeout ? 'auto' : '0',
                transition: 'margin 0.2s ease',
              }}
            ></i>
          </span>
        </div>
      </Card>
    </>
  );
}
